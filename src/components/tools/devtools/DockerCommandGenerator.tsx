"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconCopy, IconTrash, IconDownload, IconBox } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

interface DockerCommand {
  image: string;
  tag: string;
  name: string;
  ports: Array<{ host: string; container: string }>;
  volumes: Array<{ host: string; container: string }>;
  envVars: Array<{ key: string; value: string }>;
  network: string;
  restart: "no" | "always" | "on-failure" | "unless-stopped";
  memory: string;
  cpus: string;
  command: string;
}

export default function DockerCommandGenerator() {
  const [command, setCommand] = useState<DockerCommand>({
    image: "nginx",
    tag: "latest",
    name: "my-container",
    ports: [{ host: "80", container: "80" }],
    volumes: [{ host: "./data", container: "/data" }],
    envVars: [{ key: "ENV_VAR", value: "value" }],
    network: "bridge",
    restart: "unless-stopped",
    memory: "512m",
    cpus: "0.5",
    command: "",
  });

  const [dockerComposeView, setDockerComposeView] = useState(false);

  const handlePortChange = (index: number, field: "host" | "container", value: string) => {
    const newPorts = [...command.ports];
    newPorts[index][field] = value;
    setCommand({ ...command, ports: newPorts });
  };

  const handleVolumeChange = (index: number, field: "host" | "container", value: string) => {
    const newVolumes = [...command.volumes];
    newVolumes[index][field] = value;
    setCommand({ ...command, volumes: newVolumes });
  };

  const handleEnvVarChange = (index: number, field: "key" | "value", value: string) => {
    const newEnvVars = [...command.envVars];
    newEnvVars[index][field] = value;
    setCommand({ ...command, envVars: newEnvVars });
  };

  const addPort = () => {
    setCommand({
      ...command,
      ports: [...command.ports, { host: "", container: "" }],
    });
  };

  const removePort = (index: number) => {
    const newPorts = command.ports.filter((_, i) => i !== index);
    setCommand({ ...command, ports: newPorts });
  };

  const addVolume = () => {
    setCommand({
      ...command,
      volumes: [...command.volumes, { host: "", container: "" }],
    });
  };

  const removeVolume = (index: number) => {
    const newVolumes = command.volumes.filter((_, i) => i !== index);
    setCommand({ ...command, volumes: newVolumes });
  };

  const addEnvVar = () => {
    setCommand({
      ...command,
      envVars: [...command.envVars, { key: "", value: "" }],
    });
  };

  const removeEnvVar = (index: number) => {
    const newEnvVars = command.envVars.filter((_, i) => i !== index);
    setCommand({ ...command, envVars: newEnvVars });
  };

  const resetForm = () => {
    setCommand({
      image: "nginx",
      tag: "latest",
      name: "my-container",
      ports: [{ host: "80", container: "80" }],
      volumes: [{ host: "./data", container: "/data" }],
      envVars: [{ key: "ENV_VAR", value: "value" }],
      network: "bridge",
      restart: "unless-stopped",
      memory: "512m",
      cpus: "0.5",
      command: "",
    });
  };

  const generateDockerCommand = () => {
    let cmd = `docker run -d`;

    if (command.name) {
      cmd += ` --name ${command.name}`;
    }

    command.ports.forEach((port) => {
      if (port.host && port.container) {
        cmd += ` -p ${port.host}:${port.container}`;
      }
    });

    command.volumes.forEach((volume) => {
      if (volume.host && volume.container) {
        cmd += ` -v ${volume.host}:${volume.container}`;
      }
    });

    command.envVars.forEach((env) => {
      if (env.key && env.value) {
        cmd += ` -e ${env.key}=${env.value}`;
      }
    });

    if (command.network) {
      cmd += ` --network ${command.network}`;
    }

    if (command.restart) {
      cmd += ` --restart ${command.restart}`;
    }

    if (command.memory) {
      cmd += ` --memory ${command.memory}`;
    }

    if (command.cpus) {
      cmd += ` --cpus ${command.cpus}`;
    }

    cmd += ` ${command.image}:${command.tag}`;

    if (command.command) {
      cmd += ` ${command.command}`;
    }

    return cmd;
  };

  const generateDockerCompose = () => {
    let compose = `version: '3'

services:
  ${command.name}:
    image: ${command.image}:${command.tag}`;

    if (command.restart) {
      compose += `
    restart: ${command.restart}`;
    }

    if (command.command) {
      compose += `
    command: ${command.command}`;
    }

    if (command.ports.length > 0 && command.ports[0].host && command.ports[0].container) {
      compose += `
    ports:`;
      command.ports.forEach((port) => {
        if (port.host && port.container) {
          compose += `
      - "${port.host}:${port.container}"`;
        }
      });
    }

    if (command.volumes.length > 0 && command.volumes[0].host && command.volumes[0].container) {
      compose += `
    volumes:`;
      command.volumes.forEach((volume) => {
        if (volume.host && volume.container) {
          compose += `
      - ${volume.host}:${volume.container}`;
        }
      });
    }

    if (command.envVars.length > 0 && command.envVars[0].key && command.envVars[0].value) {
      compose += `
    environment:`;
      command.envVars.forEach((env) => {
        if (env.key && env.value) {
          compose += `
      - ${env.key}=${env.value}`;
        }
      });
    }

    if (command.network !== "bridge") {
      compose += `
    networks:
      - ${command.network}`;
      
      compose += `

networks:
  ${command.network}:
    driver: bridge`;
    }

    if (command.memory || command.cpus) {
      compose += `
    deploy:
      resources:
        limits:`;
      
      if (command.memory) {
        compose += `
          memory: ${command.memory}`;
      }
      
      if (command.cpus) {
        compose += `
          cpus: '${command.cpus}'`;
      }
    }

    return compose;
  };

  const copyToClipboard = () => {
    const text = dockerComposeView ? generateDockerCompose() : generateDockerCommand();
    navigator.clipboard.writeText(text);
    toast.success("Commande copiée dans le presse-papiers");
  };

  const downloadFile = () => {
    const text = dockerComposeView ? generateDockerCompose() : generateDockerCommand();
    const filename = dockerComposeView ? "docker-compose.yml" : "docker-command.sh";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Fichier ${filename} téléchargé`);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <IconBox className="mr-2 text-blue-500" size={24} />
          Générateur de commandes Docker
        </h2>
        <div className="flex">
          <button
            onClick={() => setDockerComposeView(false)}
            className={`px-3 py-1.5 rounded-l-md text-sm ${
              !dockerComposeView
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Docker Run
          </button>
          <button
            onClick={() => setDockerComposeView(true)}
            className={`px-3 py-1.5 rounded-r-md text-sm ${
              dockerComposeView
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Docker Compose
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Image
              </label>
              <input
                type="text"
                value={command.image}
                onChange={(e) =>
                  setCommand({ ...command, image: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="nginx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tag
              </label>
              <input
                type="text"
                value={command.tag}
                onChange={(e) =>
                  setCommand({ ...command, tag: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="latest"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nom du conteneur
            </label>
            <input
              type="text"
              value={command.name}
              onChange={(e) =>
                setCommand({ ...command, name: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              placeholder="my-container"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Ports (hôte:conteneur)
              </label>
              <button
                onClick={addPort}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Ajouter un port
              </button>
            </div>
            {command.ports.map((port, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={port.host}
                  onChange={(e) =>
                    handlePortChange(index, "host", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white"
                  placeholder="80"
                />
                <span className="px-2 bg-slate-700 text-slate-300">:</span>
                <input
                  type="text"
                  value={port.container}
                  onChange={(e) =>
                    handlePortChange(index, "container", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white"
                  placeholder="80"
                />
                <button
                  onClick={() => removePort(index)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  disabled={command.ports.length <= 1}
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Volumes (hôte:conteneur)
              </label>
              <button
                onClick={addVolume}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Ajouter un volume
              </button>
            </div>
            {command.volumes.map((volume, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={volume.host}
                  onChange={(e) =>
                    handleVolumeChange(index, "host", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white"
                  placeholder="./data"
                />
                <span className="px-2 bg-slate-700 text-slate-300">:</span>
                <input
                  type="text"
                  value={volume.container}
                  onChange={(e) =>
                    handleVolumeChange(index, "container", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white"
                  placeholder="/data"
                />
                <button
                  onClick={() => removeVolume(index)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  disabled={command.volumes.length <= 1}
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Variables d'environnement
              </label>
              <button
                onClick={addEnvVar}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Ajouter une variable
              </button>
            </div>
            {command.envVars.map((env, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) =>
                    handleEnvVarChange(index, "key", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white"
                  placeholder="ENV_VAR"
                />
                <span className="px-2 bg-slate-700 text-slate-300">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) =>
                    handleEnvVarChange(index, "value", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white"
                  placeholder="value"
                />
                <button
                  onClick={() => removeEnvVar(index)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  disabled={command.envVars.length <= 1}
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Réseau
              </label>
              <select
                value={command.network}
                onChange={(e) =>
                  setCommand({ ...command, network: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="bridge">bridge</option>
                <option value="host">host</option>
                <option value="none">none</option>
                <option value="custom-network">custom-network</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Redémarrage
              </label>
              <select
                value={command.restart}
                onChange={(e) =>
                  setCommand({
                    ...command,
                    restart: e.target.value as "no" | "always" | "on-failure" | "unless-stopped",
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="no">no</option>
                <option value="always">always</option>
                <option value="on-failure">on-failure</option>
                <option value="unless-stopped">unless-stopped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Mémoire
              </label>
              <input
                type="text"
                value={command.memory}
                onChange={(e) =>
                  setCommand({ ...command, memory: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="512m"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                CPUs
              </label>
              <input
                type="text"
                value={command.cpus}
                onChange={(e) =>
                  setCommand({ ...command, cpus: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="0.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Commande
            </label>
            <input
              type="text"
              value={command.command}
              onChange={(e) =>
                setCommand({ ...command, command: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              placeholder="commande à lancer dans le conteneur (optionnel)"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={resetForm}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
            >
              <IconTrash size={16} className="mr-1" />
              Réinitialiser
            </button>
          </div>
        </div>

        <div>
          <div className="bg-slate-700/30 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">
                {dockerComposeView ? "docker-compose.yml" : "Commande Docker"}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="text-blue-400 hover:text-blue-300"
                  title="Copier"
                >
                  <IconCopy size={18} />
                </button>
                <button
                  onClick={downloadFile}
                  className="text-green-400 hover:text-green-300"
                  title="Télécharger"
                >
                  <IconDownload size={18} />
                </button>
              </div>
            </div>
            <pre className="bg-slate-900 p-3 rounded-md overflow-x-auto text-sm text-white whitespace-pre-wrap">
              {dockerComposeView
                ? generateDockerCompose()
                : generateDockerCommand()}
            </pre>
          </div>

          <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
            <h3 className="font-medium text-white mb-2">
              {dockerComposeView
                ? "À propos de Docker Compose"
                : "À propos des commandes Docker"}
            </h3>
            {dockerComposeView ? (
              <ul className="list-disc pl-5 space-y-1">
                <li>Docker Compose permet de définir et lancer plusieurs conteneurs Docker.</li>
                <li>Le fichier docker-compose.yml définit la configuration des services.</li>
                <li>Lancez avec <code className="bg-slate-800 px-1 rounded">docker-compose up -d</code></li>
                <li>Arrêtez avec <code className="bg-slate-800 px-1 rounded">docker-compose down</code></li>
                <li>Docker Compose v3 est compatible avec Docker Swarm.</li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                <li><code className="bg-slate-800 px-1 rounded">-p</code> : Publie les ports du conteneur.</li>
                <li><code className="bg-slate-800 px-1 rounded">-v</code> : Monte des volumes.</li>
                <li><code className="bg-slate-800 px-1 rounded">-e</code> : Définit des variables d'environnement.</li>
                <li><code className="bg-slate-800 px-1 rounded">--restart</code> : Politique de redémarrage.</li>
                <li><code className="bg-slate-800 px-1 rounded">-d</code> : Exécution en arrière-plan (détaché).</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}