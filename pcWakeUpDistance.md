PLAN GLOBAL (vue d’ensemble)
1. Activer le Wake-on-LAN (BIOS)
2. Activer le Wake-on-LAN (Windows)
3. Installer un VPN sécurisé (Tailscale)
4. Tester le réveil à distance
5. Accéder au PC (Remote Desktop)
6. Éteindre le PC à distance


⏱️ Temps total réaliste (première fois) : 45 à 60 minutes

🟩 ÉTAPE 1 — Activer le Wake-on-LAN dans le BIOS

⏱️ 10 minutes

Carte mère : Gigabyte B760M DS3H DDR4

Redémarre le PC

Appuie sur DEL (Suppr)

Va dans Advanced Mode

Onglet Power

Active :

Wake on LAN → Enabled

Power On By PCI-E → Enabled

Désactive ErP ⚠️ (sinon WoL ne marche pas)

Sauvegarde (F10)

✔️ À la fin : le port Ethernet reste alimenté PC éteint

🟩 ÉTAPE 2 — Activer le Wake-on-LAN dans Windows 11

⏱️ 10 minutes

Clic droit sur Démarrer

Gestionnaire de périphériques

Cartes réseau → Realtek Ethernet

Propriétés

Onglet Gestion de l’alimentation

☑️ Autoriser ce périphérique à réveiller l’ordinateur
☑️ Autoriser uniquement un paquet magique

Onglet Avancé

Wake on Magic Packet → Enabled

Shutdown Wake-On-Lan → Enabled

🟩 ÉTAPE 3 — Installer le VPN (solution la plus simple)

👉 Tailscale
⏱️ 10–15 minutes

Pourquoi Tailscale ?

Pas de port à ouvrir

Très sécurisé

Parfait pour débuter

Installation

Va sur tailscale.com

Installe sur :

ton PC à Paris

ton PC / téléphone en Auvergne

Connecte-toi avec le même compte

Vérifie que les deux appareils se voient

✔️ Tu as maintenant un réseau privé sécurisé

🟩 ÉTAPE 4 — Tester le réveil à distance (WoL)

⏱️ 5 minutes

Éteins le PC

Depuis l’autre appareil :

via Tailscale

utilise une app WoL (ou ligne de commande)

Envoie le Magic Packet à l’IP Tailscale

✔️ Le PC démarre → WoL validé

🟩 ÉTAPE 5 — Prendre le contrôle du PC

⏱️ 5 minutes

Windows

Utilise Remote Desktop

Paramètres → Système → Bureau à distance

Activer

Connexion via l’IP Tailscale

🖥️ Tu vois ton PC comme si tu étais devant

🟩 ÉTAPE 6 — Éteindre le PC à distance

⏱️ 2 minutes

Depuis la session distante :

Menu Démarrer → Arrêter
OU

Commande :

shutdown /s /t 0


✔️ Arrêt propre
✔️ Prêt pour un prochain réveil WoL

⏱️ RÉCAP TEMPS (réaliste débutant)
Étape	Temps
BIOS WoL	10 min
Windows WoL	10 min
VPN	10–15 min
Test WoL	5 min
Bureau à distance	5 min
Arrêt	2 min
TOTAL	45–60 min