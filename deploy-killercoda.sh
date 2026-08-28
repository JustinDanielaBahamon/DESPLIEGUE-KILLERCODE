#!/usr/bin/env bash
# ==============================================
#   DESPLIEGUE PARAMETRIZADO - KILLERCODA
#   Docker + Nginx (opcional) + ngrok (opcional)
# ==============================================
#
# A diferencia de la versión anterior, este script NO tiene
# datos fijos en el código: todo (nombre del servicio, imagen,
# puertos, variables de entorno, token de ngrok, etc.) se
# solicita de forma interactiva en tiempo de ejecución, para
# que pueda reutilizarse con distintos servicios/parámetros.
#
# Uso:
#   chmod +x deploy-killercoda-v2.sh
#   ./deploy-killercoda-v2.sh

set -euo pipefail

info()  { echo -e "\n\033[1;36m[$1] $2\033[0m"; }
ok()    { echo -e "   \033[1;32m✅ $1\033[0m"; }
warn()  { echo -e "   \033[1;33m⚠️  $1\033[0m"; }
fail()  { echo -e "   \033[1;31m❌ $1\033[0m"; exit 1; }

# Pregunta un dato al usuario, con valor por defecto opcional
ask() {
  local __resultvar=$1 __prompt=$2 __default=${3:-} __ans
  read -rp "   ➜ ${__prompt}${__default:+ [$__default]}: " __ans
  eval "$__resultvar=\"\${__ans:-$__default}\""
}

echo "=============================================="
echo "   🚀 DESPLIEGUE PARAMETRIZADO EN KILLERCODA"
echo "=============================================="

# ── [1] Verificar dependencias ───────────────────
info 1 "📦 Verificando Git, Docker y Docker Compose..."
command -v git >/dev/null 2>&1 || fail "Git no está instalado."
command -v docker >/dev/null 2>&1 || fail "Docker no está instalado."
if ! docker compose version >/dev/null 2>&1; then
  warn "Plugin de Docker Compose no encontrado, instalando..."
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi
ok "Git, Docker y Docker Compose listos"

# ── [2] Datos del servicio (solicitados al usuario) ──
info 2 "🔧 Datos del servicio a desplegar"
ask NOMBRE_SERVICIO "Nombre del servicio" "proyecto-multicapa"
ask REPO_URL        "URL del repositorio Git" "https://github.com/JustinDanielaBahamon/Despliegue.git"
ask REPO_DIR        "Carpeta destino del clonado" "$HOME/$NOMBRE_SERVICIO"
ask PROJECT_SUBDIR  "Subcarpeta del proyecto dentro del repo (vacío si es la raíz)" "proyecto-multicapa"
ask PUERTO_FRONTEND "Puerto donde quedará expuesto el servicio/proxy" "3000"
ask PUERTO_BACKEND  "Puerto interno del backend" "8080"

# ── [3] Variables de entorno del servicio ────────
info 3 "🔑 Variables de entorno del servicio"
ask DB_USER          "Usuario de base de datos" "app_user"
ask DB_PASSWORD      "Contraseña de base de datos" "changeme123"
ask DB_ROOT_PASSWORD "Contraseña root de base de datos" "rootpass123"
ask DB_NAME          "Nombre de la base de datos" "app_db"

# ── [4] Clonar o actualizar el repositorio ───────
info 4 "📥 Preparando el proyecto..."
if [ -d "$REPO_DIR/.git" ]; then
  warn "El repositorio ya existe en $REPO_DIR, actualizando con git pull..."
  git -C "$REPO_DIR" pull --ff-only
else
  git clone "$REPO_URL" "$REPO_DIR"
  ok "Repositorio clonado en $REPO_DIR"
fi
PROJECT_DIR="$REPO_DIR${PROJECT_SUBDIR:+/$PROJECT_SUBDIR}"
[ -d "$PROJECT_DIR" ] || fail "No se encontró la carpeta del proyecto: $PROJECT_DIR"
cd "$PROJECT_DIR"
ok "Proyecto listo en $PROJECT_DIR"

# ── [5] Generar .env con los datos solicitados ───
info 5 "📝 Configurando variables de entorno (.env)..."
if [ -f ".env" ]; then
  warn ".env ya existe, no se sobreescribe (evita pisar credenciales ya usadas)"
else
  cp .env.example .env
  sed -i \
    -e "s/change_me_user_pass/${DB_PASSWORD}/" \
    -e "s/change_me_root_pass/${DB_ROOT_PASSWORD}/" \
    -e "s|VITE_API_BASE_URL=http://localhost:8080/api|VITE_API_BASE_URL=/api|" \
    .env
  ok ".env generado a partir de los datos indicados"
fi

# ── [6] Proxy inverso con Nginx (opcional) ───────
info 6 "🌐 Proxy inverso con Nginx (opcional)"
ask USAR_NGINX "¿Configurar Nginx como proxy inverso? (s/n)" "s"
if [[ "$USAR_NGINX" =~ ^[sS] ]]; then
  if grep -q "proxy_pass http://backend:${PUERTO_BACKEND}/api/;" frontend/nginx.conf 2>/dev/null; then
    ok "nginx.conf ya tiene el proxy /api configurado"
  else
    warn "Configurando proxy /api en nginx.conf..."
    cat > frontend/nginx.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://backend:${PUERTO_BACKEND}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
    ok "nginx.conf configurado"
  fi
else
  warn "Se omite Nginx: el servicio quedará expuesto directamente en su puerto"
fi

# ── [7] Construir y levantar contenedores ────────
info 7 "🏗️  Construyendo y levantando contenedores..."
docker compose up --build -d
ok "Contenedores en marcha"

# ── [8] Validar que el servicio responda ─────────
info 8 "🩺 Verificando que el servicio responda..."
wait_for() {
  local desc="$1" url="$2" tries=0 max=30
  until curl -sf "$url" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [ "$tries" -ge "$max" ]; then
      fail "$desc no respondió después de ${max} intentos ($url)"
    fi
    sleep 2
  done
  ok "$desc responde ($url)"
}
wait_for "Servicio" "http://localhost:${PUERTO_FRONTEND}"

# ── [9] Publicación externa con ngrok (opcional) ──
info 9 "🌍 Publicación externa con ngrok (opcional)"
ask USAR_NGROK "¿Publicar el servicio con ngrok? (s/n)" "n"
PUBLIC_URL=""
if [[ "$USAR_NGROK" =~ ^[sS] ]]; then
  if ! command -v ngrok >/dev/null 2>&1; then
    warn "ngrok no está instalado, instalando desde el repositorio oficial..."
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list >/dev/null
    sudo apt update -qq && sudo apt install -y ngrok
  fi

  # El token se solicita con -s: no queda visible en pantalla ni en el historial de comandos
  read -rsp "   ➜ Token de autenticación de ngrok (no se mostrará en pantalla): " NGROK_TOKEN
  echo
  [ -n "$NGROK_TOKEN" ] || fail "El token de ngrok es obligatorio para publicar el servicio."

  ngrok config add-authtoken "$NGROK_TOKEN"
  ngrok http "$PUERTO_FRONTEND" --log=stdout > "$HOME/ngrok_${NOMBRE_SERVICIO}.log" 2>&1 &
  ok "Túnel de ngrok iniciado hacia el puerto ${PUERTO_FRONTEND}"

  info 9 "⏳ Esperando la URL pública de ngrok..."
  tries=0
  until PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | head -n1 | cut -d'"' -f4) && [ -n "$PUBLIC_URL" ]; do
    tries=$((tries + 1))
    [ "$tries" -ge 15 ] && fail "No se pudo obtener la URL pública de ngrok."
    sleep 2
  done
  ok "Servicio publicado en: $PUBLIC_URL"
else
  warn "Se omite la publicación con ngrok"
fi

# ── Resumen final ─────────────────────────────────
echo ""
echo "=============================================="
echo "   ✅ DESPLIEGUE COMPLETO"
echo "   Servicio: $NOMBRE_SERVICIO"
echo "   Local:    http://localhost:${PUERTO_FRONTEND}"
if [ -n "$PUBLIC_URL" ]; then
  echo "   Público:  $PUBLIC_URL"
fi
echo "=============================================="