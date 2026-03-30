{
  "name": "kanban-schulung-lise-src",
  "version": "4.0.0",
  "description": "Generierungsskripte für die Kanban-Schulungs-Materialien (lise GmbH)",
  "private": true,
  "scripts": {
    "build:all": "node create_einladung_v4.js && node create_s1_v4.js && node create_s2_v4.js && node create_s3_v4.js && node create_handout_v4.js && node create_linksammlung_v4.js",
    "build:einladung": "node create_einladung_v4.js",
    "build:s1": "node create_s1_v4.js",
    "build:s2": "node create_s2_v4.js",
    "build:s3": "node create_s3_v4.js",
    "build:handout": "node create_handout_v4.js",
    "build:linksammlung": "node create_linksammlung_v4.js"
  },
  "dependencies": {
    "docx": "^8.5.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
