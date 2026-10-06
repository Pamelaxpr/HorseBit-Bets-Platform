FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 python3-pip curl sshpass git \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Corrección: "ansible-core" en lugar de "ansible core"
RUN pip3 install --no-cache-dir ansible ansible-core \
    "azure-cli-core>=2.34.0" \
    "azure-identity>=1.15.0" \
    "azure-mgmt-compute>=29.0.0" \
    "azure-mgmt-core>=1.3.1" \
    "azure-mgmt-network>=21.0.1" \
    "azure-mgmt-resource>=21.1.0"

RUN ansible-galaxy collection install azure.azcollection

WORKDIR /ansible
CMD ["/bin/bash"]
