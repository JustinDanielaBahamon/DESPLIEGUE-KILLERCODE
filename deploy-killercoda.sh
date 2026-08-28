#!/usr/bin/env bash
# ==============================================
#   🚀 DESPLIEGUE PROYECTO MULTICAPA
#   🐳 Killercoda + Docker + Spring + React
# ==============================================
#
# Uso:
#   chmod +x deploy-killercoda.sh
#   ./deploy-killercoda.sh
#
# Funciona en dos escenarios, sin configuración extra:
#   A) Ya tenés el repo clonado y corrés el script desde adentro
#      (por ejemplo porque hiciste "git clone" del repo completo).
#      -> No vuelve a clonar nada, usa el checkout donde ya estás.
#   B) Estás en una sesión nueva de Killercoda sin nada clonado
#      todavía, y solo bajaste este archivo suelto (con curl).
#      -> Clona el repo en $HOME/Despliegue.
#
# Se puede correr varias veces seguidas sin romper nada:
# no vuelve a clonar si el repo ya existe, no pisa un .env
# ya configurado, y siempre valida/corrige el nginx.conf.

set -euo pipefail

REPO_URL="https://github.com/JustinDanielaBahamon/Despliegue.git"
FALLBACK_REPO_DIR="$HOME/Despliegue"
TOTAL_STEPS=8

info()  { echo -e "\n\033[1;36m[$1/${TOTAL_STEPS}] $2\033[0m"; }
ok()    { echo -e "   \033[1;32m✅ $1\033[0m"; }
warn()  { echo -e "   \033[1;33m⚠️  $1\033[0m"; }
fail()  { echo -e "   \033[1;31m❌ $1\033[0m"; exit 1; }

echo "=============================================="
echo "   🚀 DESPLIEGUE PROYECTO MULTICAPA"
echo "   🐳 Killercoda + Docker + Spring + React"
echo "=============================================="

# ── [1/8] Git ────────────────────────────────────
info 1 "📦 Verificando Git..."
command -v git >/dev/null 2>&1 || fail "Git no está instalado."
ok "Git listo ($(git --version))"

# ── [2/8] Docker ─────────────────────────────────
info 2 "🐳 Verificando Docker..."
command -v docker >/dev/null 2>&1 || fail "Docker no está instalado."
ok "Docker: $(docker --version)"

# ── [3/8] Docker Compose plugin ──────────────────
info 3 "🔧 Verificando Docker Compose..."
if ! docker compose version >/dev/null 2>&1; then
  warn "Plugin no encontrado, instalando..."
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi
ok "Docker Compose: $(docker compose version)"

# ── [4/8] Localizar o clonar el proyecto ─────────
info 4 "📥 Preparando proyecto..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if git -C "$SCRIPT_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
  REPO_DIR="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
  ok "Ya estás dentro de un checkout del repo, uso: $REPO_DIR"
elif [ -d "$FALLBACK_REPO_DIR/.git" ]; then
  warn "El repo ya existe en $FALLBACK_REPO_DIR, actualizando con git pull..."
  git -C "$FALLBACK_REPO_DIR" pull --ff-only
  REPO_DIR="$FALLBACK_REPO_DIR"
  ok "Repositorio actualizado"
else
  git clone "$REPO_URL" "$FALLBACK_REPO_DIR"
  REPO_DIR="$FALLBACK_REPO_DIR"
  ok "Repositorio clonado en $REPO_DIR"
fi

PROJECT_DIR="$REPO_DIR/proyecto-multicapa"
[ -d "$PROJECT_DIR" ] || fail "No se encontró $PROJECT_DIR."
cd "$PROJECT_DIR"

# ── [5/8] Variables de entorno (.env) ────────────
info 5 "🔑 Configurando variables de entorno..."
if [ -f ".env" ]; then
  warn ".env ya existe, no se toca (evita pisar credenciales ya usadas)"
else
  cp .env.example .env
  sed -i \
    -e 's/change_me_user_pass/multicapa123/' \
    -e 's/change_me_root_pass/root123/' \
    -e 's|VITE_API_BASE_URL=http://localhost:8080/api|VITE_API_BASE_URL=/api|' \
    .env
  ok ".env creado a partir de .env.example"
fi

# ── [6/8] Verificar proxy /api en Nginx ──────────
info 6 "🌐 Verificando proxy /api en Nginx..."
if grep -q "proxy_pass http://backend:8080/api/;" frontend/nginx.conf 2>/dev/null; then
  ok "nginx.conf ya tiene el proxy /api (viene commiteado en el repo)"
else
  warn "nginx.conf no tenía el proxy /api, lo corrijo ahora..."
  cat > frontend/nginx.conf <<'EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Enviar las peticiones /api al backend Spring Boot
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend React + React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
  ok "nginx.conf corregido"
fi

# ── [7/8] Build y levantar contenedores ──────────
info 7 "🏗️  Construyendo y levantando contenedores..."
docker compose up --build -d
ok "Contenedores en marcha"

# ── [8/8] Verificación de salud ───────────────────
info 8 "🩺 Verificando que todo responda..."

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

wait_for "Backend"  "http://localhost:8080/api/motos"
wait_for "Frontend" "http://localhost:3000"

echo -e "\n   Probando proxy /api a través del frontend..."
if curl -s http://localhost:3000/api/motos | grep -q '"marca"'; then
  ok "El frontend está proxeando /api correctamente al backend"
else
  fail "El frontend responde pero /api/motos no devuelve JSON del backend (revisá nginx.conf dentro del contenedor)"
fi

echo ""
docker compose ps
echo ""
echo "=============================================="
echo "   ✅ DESPLIEGUE COMPLETO"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080/api/motos"
echo "=============================================="
