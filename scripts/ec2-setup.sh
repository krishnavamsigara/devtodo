#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Initializing AWS EC2 Docker Environment"
echo "=========================================="

# 1. Update package lists & install prerequisites
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 2. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 3. Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine, CLI, and Docker Compose plugin
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Add current user (ubuntu) to docker group
sudo usermod -aG docker $USER

# 6. Enable and start Docker service
sudo systemctl enable docker
sudo systemctl restart docker

# 7. Create app working directory
mkdir -p ~/app

echo "=========================================="
echo "✅ Docker & Docker Compose installation complete!"
echo "👉 Note: Log out and log back in or run 'newgrp docker' to apply user group changes."
echo "=========================================="
