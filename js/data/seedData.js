// Datos iniciales del Tracker tomados del backup limpio exportado el 2026-09-20.
// Este seed representa un Universo SIN INICIAR: WM2 está abierta, sin registros,
// sin Exposición y con el año del Universo en 0.
//
// La app usa este contenido únicamente cuando no existe un estado guardado en
// localStorage. A partir de ahí, el estado se guarda y se lee desde storage.js.

const SEED = {
  roster :   [
    {
      "id": "aj-styles",
      "nombre": "AJ Styles",
      "genero": "Hombre",
      "overallBase": 85,
      "overallActual": 85,
      "edadBase": 49,
      "edadActual": 49,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "akam",
      "nombre": "Akam",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "akira-tozawa",
      "nombre": "Akira Tozawa",
      "genero": "Hombre",
      "overallBase": 68,
      "overallActual": 68,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "alba-fyre",
      "nombre": "Alba Fyre",
      "genero": "Mujer",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "aleister-black-dlc",
      "nombre": "Aleister Black DLC",
      "genero": "Hombre",
      "overallBase": 82,
      "overallActual": 82,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "alex-shelley-dlc",
      "nombre": "Alex Shelley DLC",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "alexa-bliss",
      "nombre": "Alexa Bliss",
      "genero": "Mujer",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "andrade",
      "nombre": "Andrade",
      "genero": "Hombre",
      "overallBase": 82,
      "overallActual": 82,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "andre-chase",
      "nombre": "Andre Chase",
      "genero": "Hombre",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "angel",
      "nombre": "Angel",
      "genero": "Hombre",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "angelo-dawkins",
      "nombre": "Angelo Dawkins",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "apollo-crews",
      "nombre": "Apollo Crews",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "ashante-thee-adonis",
      "nombre": "Ashante Thee Adonis",
      "genero": "Hombre",
      "overallBase": 62,
      "overallActual": 62,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "asuka",
      "nombre": "Asuka",
      "genero": "Mujer",
      "overallBase": 90,
      "overallActual": 90,
      "edadBase": 44,
      "edadActual": 44,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "austin-theory",
      "nombre": "Austin Theory",
      "genero": "Hombre",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "axiom",
      "nombre": "Axiom",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "b-fab",
      "nombre": "B-Fab",
      "genero": "Mujer",
      "overallBase": 68,
      "overallActual": 68,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "baron-corbin",
      "nombre": "Baron Corbin",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "bayley",
      "nombre": "Bayley",
      "genero": "Mujer",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "becky-lynch",
      "nombre": "Becky Lynch",
      "genero": "Mujer",
      "overallBase": 92,
      "overallActual": 92,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "berto",
      "nombre": "Berto",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "bianca-belair",
      "nombre": "Bianca Belair",
      "genero": "Mujer",
      "overallBase": 95,
      "overallActual": 95,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "blair-davenport",
      "nombre": "Blair Davenport",
      "genero": "Mujer",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "braun-strowman",
      "nombre": "Braun Strowman",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "brock-lesnar",
      "nombre": "Brock Lesnar",
      "genero": "Hombre",
      "overallBase": 94,
      "overallActual": 94,
      "edadBase": 49,
      "edadActual": 49,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "bron-breakker",
      "nombre": "Bron Breakker",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 28,
      "edadActual": 28,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "bronson-reed",
      "nombre": "Bronson Reed",
      "genero": "Hombre",
      "overallBase": 85,
      "overallActual": 85,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "brooks-jensen",
      "nombre": "Brooks Jensen",
      "genero": "Hombre",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 25,
      "edadActual": 25,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "brutus-creed",
      "nombre": "Brutus Creed",
      "genero": "Hombre",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "candice-lerae",
      "nombre": "Candice LeRae",
      "genero": "Mujer",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 40,
      "edadActual": 40,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "carlito",
      "nombre": "Carlito",
      "genero": "Hombre",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 47,
      "edadActual": 47,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "carmella",
      "nombre": "Carmella",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "carmelo-hayes",
      "nombre": "Carmelo Hayes",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "cedric-alexander",
      "nombre": "Cedric Alexander",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "chad-gable",
      "nombre": "Chad Gable",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 40,
      "edadActual": 40,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "channing-stacks-lorenzo",
      "nombre": "Channing \"Stacks\" Lorenzo",
      "genero": "Hombre",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "charlie-dempsey",
      "nombre": "Charlie Dempsey",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "charlotte-flair",
      "nombre": "Charlotte Flair",
      "genero": "Mujer",
      "overallBase": 92,
      "overallActual": 92,
      "edadBase": 40,
      "edadActual": 40,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "chelsea-green",
      "nombre": "Chelsea Green",
      "genero": "Mujer",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "chris-sabin-dlc",
      "nombre": "Chris Sabin DLC",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 44,
      "edadActual": 44,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "cm-punk",
      "nombre": "CM Punk",
      "genero": "Hombre",
      "overallBase": 92,
      "overallActual": 92,
      "edadBase": 47,
      "edadActual": 47,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "cody-rhodes",
      "nombre": "Cody Rhodes",
      "genero": "Hombre",
      "overallBase": 96,
      "overallActual": 96,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "cora-jade",
      "nombre": "Cora Jade",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 25,
      "edadActual": 25,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "cruz-del-toro",
      "nombre": "Cruz Del Toro",
      "genero": "Hombre",
      "overallBase": 69,
      "overallActual": 69,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "dakota-kai",
      "nombre": "Dakota Kai",
      "genero": "Mujer",
      "overallBase": 82,
      "overallActual": 82,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "damian-priest",
      "nombre": "Damian Priest",
      "genero": "Hombre",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "dexter-lumis-dlc",
      "nombre": "Dexter Lumis DLC",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "dominik-mysterio",
      "nombre": "Dominik Mysterio",
      "genero": "Hombre",
      "overallBase": 84,
      "overallActual": 84,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "dragon-lee",
      "nombre": "Dragon Lee",
      "genero": "Hombre",
      "overallBase": 78,
      "overallActual": 78,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "drew-mcintyre",
      "nombre": "Drew McIntyre",
      "genero": "Hombre",
      "overallBase": 91,
      "overallActual": 91,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "duke-hudson",
      "nombre": "Duke Hudson",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "eddy-thorpe",
      "nombre": "Eddy Thorpe",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "elektra-lopez",
      "nombre": "Elektra Lopez",
      "genero": "Mujer",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "elton-prince",
      "nombre": "Elton Prince",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "erick-rowan-dlc",
      "nombre": "Erick Rowan DLC",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 44,
      "edadActual": 44,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "erik",
      "nombre": "Erik",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "ethan-page",
      "nombre": "Ethan Page",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "fallon-henley",
      "nombre": "Fallon Henley",
      "genero": "Mujer",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "finn-balor",
      "nombre": "Finn Bálor",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 45,
      "edadActual": 45,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "gigi-dolin",
      "nombre": "Gigi Dolin",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "giovanni-vinci",
      "nombre": "Giovanni Vinci",
      "genero": "Hombre",
      "overallBase": 69,
      "overallActual": 69,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "giulia-dlc",
      "nombre": "Giulia DLC",
      "genero": "Mujer",
      "overallBase": 82,
      "overallActual": 82,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "grayson-waller",
      "nombre": "Grayson Waller",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "gunther",
      "nombre": "Gunther",
      "genero": "Hombre",
      "overallBase": 92,
      "overallActual": 92,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "ilja-dragunov",
      "nombre": "Ilja Dragunov",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "indi-hartwell",
      "nombre": "Indi Hartwell",
      "genero": "Mujer",
      "overallBase": 63,
      "overallActual": 63,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "isla-dawn",
      "nombre": "Isla Dawn",
      "genero": "Mujer",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "ivar",
      "nombre": "Ivar",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "ivy-nile",
      "nombre": "Ivy Nile",
      "genero": "Mujer",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "iyo-sky",
      "nombre": "IYO SKY",
      "genero": "Mujer",
      "overallBase": 89,
      "overallActual": 89,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "jacob-fatu",
      "nombre": "Jacob Fatu",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "jacy-jayne",
      "nombre": "Jacy Jayne",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "jade-cargill",
      "nombre": "Jade Cargill",
      "genero": "Mujer",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "jaida-parker",
      "nombre": "Jaida Parker",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 27,
      "edadActual": 27,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "jakara-jackson",
      "nombre": "Jakara Jackson",
      "genero": "Mujer",
      "overallBase": 69,
      "overallActual": 69,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "jd-mcdonagh",
      "nombre": "JD McDonagh",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "jevon-evans",
      "nombre": "Je'Von Evans",
      "genero": "Hombre",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 22,
      "edadActual": 22,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "jey-uso",
      "nombre": "Jey Uso",
      "genero": "Hombre",
      "overallBase": 90,
      "overallActual": 90,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "jimmy-uso",
      "nombre": "Jimmy Uso",
      "genero": "Hombre",
      "overallBase": 84,
      "overallActual": 84,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "joaquin-wilde",
      "nombre": "Joaquin Wilde",
      "genero": "Hombre",
      "overallBase": 68,
      "overallActual": 68,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "joe-coffey",
      "nombre": "Joe Coffey",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "joe-gacy-dlc",
      "nombre": "Joe Gacy DLC",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "john-cena",
      "nombre": "John Cena",
      "genero": "Hombre",
      "overallBase": 94,
      "overallActual": 94,
      "edadBase": 49,
      "edadActual": 49,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "johnny-gargano",
      "nombre": "Johnny Gargano",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "jordynne-grace-dlc",
      "nombre": "Jordynne Grace DLC",
      "genero": "Mujer",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "josh-briggs",
      "nombre": "Josh Briggs",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "julius-creed",
      "nombre": "Julius Creed",
      "genero": "Hombre",
      "overallBase": 78,
      "overallActual": 78,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "kairi-sane",
      "nombre": "Kairi Sane",
      "genero": "Mujer",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "karl-anderson",
      "nombre": "Karl Anderson",
      "genero": "Hombre",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 46,
      "edadActual": 46,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "karrion-kross",
      "nombre": "Karrion Kross",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "katana-chance",
      "nombre": "Katana Chance",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "kayden-carter",
      "nombre": "Kayden Carter",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "kelani-jordan",
      "nombre": "Kelani Jordan",
      "genero": "Mujer",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 27,
      "edadActual": 27,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "kevin-owens",
      "nombre": "Kevin Owens",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "kiana-james",
      "nombre": "Kiana James",
      "genero": "Mujer",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "kit-wilson",
      "nombre": "Kit Wilson",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "kofi-kingston",
      "nombre": "Kofi Kingston",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 45,
      "edadActual": 45,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "la-knight",
      "nombre": "LA Knight",
      "genero": "Hombre",
      "overallBase": 88,
      "overallActual": 88,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "lash-legend",
      "nombre": "Lash Legend",
      "genero": "Mujer",
      "overallBase": 78,
      "overallActual": 78,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "lexis-king",
      "nombre": "Lexis King",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "liv-morgan",
      "nombre": "Liv Morgan",
      "genero": "Mujer",
      "overallBase": 91,
      "overallActual": 91,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "logan-paul",
      "nombre": "Logan Paul",
      "genero": "Hombre",
      "overallBase": 90,
      "overallActual": 90,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "lola-vice",
      "nombre": "Lola Vice",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 28,
      "edadActual": 28,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "ludwig-kaiser",
      "nombre": "Ludwig Kaiser",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "luke-gallows",
      "nombre": "Luke Gallows",
      "genero": "Hombre",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "lyra-valkyria",
      "nombre": "Lyra Valkyria",
      "genero": "Mujer",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "mark-coffey",
      "nombre": "Mark Coffey",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "maryse",
      "nombre": "Maryse",
      "genero": "Mujer",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "maxxine-dupri",
      "nombre": "Maxxine Dupri",
      "genero": "Mujer",
      "overallBase": 67,
      "overallActual": 67,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "michin",
      "nombre": "Michin",
      "genero": "Mujer",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "montez-ford",
      "nombre": "Montez Ford",
      "genero": "Hombre",
      "overallBase": 78,
      "overallActual": 78,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "naomi",
      "nombre": "Naomi",
      "genero": "Mujer",
      "overallBase": 85,
      "overallActual": 85,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "natalya",
      "nombre": "Natalya",
      "genero": "Mujer",
      "overallBase": 85,
      "overallActual": 85,
      "edadBase": 44,
      "edadActual": 44,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "nathan-frazer",
      "nombre": "Nathan Frazer",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 28,
      "edadActual": 28,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "nia-jax",
      "nombre": "Nia Jax",
      "genero": "Mujer",
      "overallBase": 88,
      "overallActual": 88,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "nikki-cross-dlc",
      "nombre": "Nikki Cross DLC",
      "genero": "Mujer",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 37,
      "edadActual": 37,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "nikkita-lyons",
      "nombre": "Nikkita Lyons",
      "genero": "Mujer",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 27,
      "edadActual": 27,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "noam-dar",
      "nombre": "Noam Dar",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "oba-femi",
      "nombre": "Oba Femi",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 28,
      "edadActual": 28,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "oro-mensah",
      "nombre": "Oro Mensah",
      "genero": "Hombre",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 30,
      "edadActual": 30,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "otis",
      "nombre": "Otis",
      "genero": "Hombre",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "penta-dlc",
      "nombre": "Penta DLC",
      "genero": "Hombre",
      "overallBase": 84,
      "overallActual": 84,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "pete-dunne",
      "nombre": "Pete Dunne",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "piper-niven",
      "nombre": "Piper Niven",
      "genero": "Mujer",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "r-truth",
      "nombre": "R-Truth",
      "genero": "Hombre",
      "overallBase": 71,
      "overallActual": 71,
      "edadBase": 54,
      "edadActual": 54,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "randy-orton",
      "nombre": "Randy Orton",
      "genero": "Hombre",
      "overallBase": 92,
      "overallActual": 92,
      "edadBase": 46,
      "edadActual": 46,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "raquel-rodriguez",
      "nombre": "Raquel Rodriguez",
      "genero": "Mujer",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "rey-mysterio",
      "nombre": "Rey Mysterio",
      "genero": "Hombre",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 51,
      "edadActual": 51,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "rezar",
      "nombre": "Rezar",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "rhea-ripley",
      "nombre": "Rhea Ripley",
      "genero": "Mujer",
      "overallBase": 96,
      "overallActual": 96,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "ridge-holland",
      "nombre": "Ridge Holland",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 38,
      "edadActual": 38,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "roman-reigns",
      "nombre": "Roman Reigns",
      "genero": "Hombre",
      "overallBase": 96,
      "overallActual": 96,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "roxanne-perez",
      "nombre": "Roxanne Perez",
      "genero": "Mujer",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 24,
      "edadActual": 24,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "sami-zayn",
      "nombre": "Sami Zayn",
      "genero": "Hombre",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "santos-escobar",
      "nombre": "Santos Escobar",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 42,
      "edadActual": 42,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "scarlett",
      "nombre": "Scarlett",
      "genero": "Mujer",
      "overallBase": 69,
      "overallActual": 69,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "seth-freakin-rollins",
      "nombre": "Seth \"Freakin\" Rollins",
      "genero": "Hombre",
      "overallBase": 93,
      "overallActual": 93,
      "edadBase": 40,
      "edadActual": 40,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "shawn-spears",
      "nombre": "Shawn Spears",
      "genero": "Hombre",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 45,
      "edadActual": 45,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "shayna-baszler",
      "nombre": "Shayna Baszler",
      "genero": "Mujer",
      "overallBase": 84,
      "overallActual": 84,
      "edadBase": 46,
      "edadActual": 46,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "sheamus",
      "nombre": "Sheamus",
      "genero": "Hombre",
      "overallBase": 86,
      "overallActual": 86,
      "edadBase": 48,
      "edadActual": 48,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "shinsuke-nakamura",
      "nombre": "Shinsuke Nakamura",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 46,
      "edadActual": 46,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "shotzi",
      "nombre": "Shotzi",
      "genero": "Mujer",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "sol-ruca",
      "nombre": "Sol Ruca",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 26,
      "edadActual": 26,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "solo-sikoa",
      "nombre": "Solo Sikoa",
      "genero": "Hombre",
      "overallBase": 88,
      "overallActual": 88,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "sonya-deville",
      "nombre": "Sonya Deville",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "stephanie-vaquer-dlc",
      "nombre": "Stephanie Vaquer DLC",
      "genero": "Mujer",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 33,
      "edadActual": 33,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "tama-tonga",
      "nombre": "Tama Tonga",
      "genero": "Hombre",
      "overallBase": 83,
      "overallActual": 83,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "tatum-paxley",
      "nombre": "Tatum Paxley",
      "genero": "Mujer",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "tegan-nox",
      "nombre": "Tegan Nox",
      "genero": "Mujer",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "the-miz",
      "nombre": "The Miz",
      "genero": "Hombre",
      "overallBase": 81,
      "overallActual": 81,
      "edadBase": 45,
      "edadActual": 45,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "thea-hail",
      "nombre": "Thea Hail",
      "genero": "Mujer",
      "overallBase": 75,
      "overallActual": 75,
      "edadBase": 22,
      "edadActual": 22,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "tiffany-stratton",
      "nombre": "Tiffany Stratton",
      "genero": "Mujer",
      "overallBase": 85,
      "overallActual": 85,
      "edadBase": 27,
      "edadActual": 27,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "tommaso-ciampa",
      "nombre": "Tommaso Ciampa",
      "genero": "Hombre",
      "overallBase": 77,
      "overallActual": 77,
      "edadBase": 41,
      "edadActual": 41,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "tonga-loa",
      "nombre": "Tonga Loa",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 43,
      "edadActual": 43,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "tony-dangelo",
      "nombre": "Tony D'Angelo",
      "genero": "Hombre",
      "overallBase": 79,
      "overallActual": 79,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "trick-williams",
      "nombre": "Trick Williams",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "tyler-bate",
      "nombre": "Tyler Bate",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 29,
      "edadActual": 29,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "uncle-howdy-dlc",
      "nombre": "Uncle Howdy DLC",
      "genero": "Hombre",
      "overallBase": 87,
      "overallActual": 87,
      "edadBase": 36,
      "edadActual": 36,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "valhalla",
      "nombre": "Valhalla",
      "genero": "Mujer",
      "overallBase": 63,
      "overallActual": 63,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "wendy-choo",
      "nombre": "Wendy Choo",
      "genero": "Mujer",
      "overallBase": 72,
      "overallActual": 72,
      "edadBase": 34,
      "edadActual": 34,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "wes-lee",
      "nombre": "Wes Lee",
      "genero": "Hombre",
      "overallBase": 76,
      "overallActual": 76,
      "edadBase": 31,
      "edadActual": 31,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "wolfgang",
      "nombre": "Wolfgang",
      "genero": "Hombre",
      "overallBase": 73,
      "overallActual": 73,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "NXT"
      ]
    },
    {
      "id": "xavier-woods",
      "nombre": "Xavier Woods",
      "genero": "Hombre",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 39,
      "edadActual": 39,
      "shows": [
        "RAW"
      ]
    },
    {
      "id": "zelina-vega",
      "nombre": "Zelina Vega",
      "genero": "Mujer",
      "overallBase": 74,
      "overallActual": 74,
      "edadBase": 35,
      "edadActual": 35,
      "shows": [
        "SmackDown"
      ]
    },
    {
      "id": "zoey-stark",
      "nombre": "Zoey Stark",
      "genero": "Mujer",
      "overallBase": 80,
      "overallActual": 80,
      "edadBase": 32,
      "edadActual": 32,
      "shows": [
        "RAW"
      ]
    }
  ],
  temporadas :   [
    {
      "id": "WM2",
      "anterior": null,
      "cerrada": false,
      "registros": []
    }
  ],
  titulosHistorial :   [
    {
      "campeonato": "Campeonato Mundial de los Pesos Pesados",
      "historial": [
        {
          "nombre": "DAMIAN PRIEST",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DREW MCINTYRE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "GUNTHER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SETH \"FREAKIN\" ROLLINS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Intercontinental de la WWE",
      "historial": [
        {
          "nombre": "THE MIZ",
          "titulosJuego": 8,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KOFI KINGSTON",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SAMI ZAYN",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRON BREAKKER",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CODY RHODES",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "FINN BÁLOR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KEVIN OWENS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REY MYSTERIO",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SETH \"FREAKIN\" ROLLINS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHINSUKE NAKAMURA",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AJ STYLES",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "APOLLO CREWS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRAUN STROWMAN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARLITO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CM PUNK",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DREW McINTYRE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "GUNTHER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JEY USO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RANDY ORTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ROMAN REIGNS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Título Mundial por Parejas — RAW",
      "historial": [
        {
          "nombre": "KOFI KINGSTON",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SETH \"FREAKIN\" ROLLINS",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "THE MIZ",
          "titulosJuego": 5,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CODY RHODES",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JEY USO",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REY MYSTERIO",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHEAMUS",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "XAVIER WOODS",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "FINN BÁLOR",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JIMMY USO",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRAUN STROWMAN",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHAD GABLE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DAMIAN PRIEST",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DREW McINTYRE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ERIK",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IVAR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JOHN CENA",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KARL ANDERSON",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LUKE GALLOWS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "R-TRUTH",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RANDY ORTON",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AJ STYLES",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AKAM",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ANGELO DAWKINS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARLITO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CEDRIC ALEXANDER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JD McDONAGH",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KEVIN OWENS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "MONTEZ FORD",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "OMOS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "OTIS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REZAR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ROMAN REIGNS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SAMI ZAYN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Título por Parejas de la WWE — SmackDown",
      "historial": [
        {
          "nombre": "JEY USO",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KOFI KINGSTON",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "XAVIER WOODS",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JIMMY USO",
          "titulosJuego": 5,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DAMIAN PRIEST",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "FINN BÁLOR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JOHNNY GARGANO",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "THE MIZ",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TOMMASO CIAMPA",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "\"DIRTY\" DOMINIK MYSTERIO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALEX SHELLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ANGELO DAWKINS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AUSTIN THEORY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHAD GABLE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHRIS SABIN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CODY RHODES",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "GRAYSON WALLER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JACOB FATU",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KEVIN OWENS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "MONTEZ FORD",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RANDY ORTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REY MYSTERIO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SAMI ZAYN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHEAMUS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHINSUKE NAKAMURA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TAMA TONGA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TONGA LOA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Mundial Femenino de la WWE — RAW",
      "historial": [
        {
          "nombre": "CHARLOTTE FLAIR",
          "titulosJuego": 7,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BECKY LYNCH",
          "titulosJuego": 5,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALEXA BLISS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BAYLEY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LIV MORGAN",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NAOMI",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RHEA RIPLEY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ASUKA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BIANCA BELAIR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARMELLA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IYO SKY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NATALYA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Femenino por Parejas de la WWE",
      "historial": [
        {
          "nombre": "ASUKA",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RAQUEL RODRIGUEZ",
          "titulosJuego": 4,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALEXA BLISS",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LIV MORGAN",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NIKKI CROSS",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHAYNA BASZLER",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BAYLEY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BIANCA BELAIR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DAKOTA KAI",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IYO SKY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JADE CARGILL",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KAIRI SANE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NAOMI",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NIA JAX",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALBA FYRE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BECKY LYNCH",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARMELLA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHARLOTTE FLAIR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHELSEA GREEN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ISLA DAWN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KATANA CHANCE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KAYDEN CARTER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NATALYA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "PIPER NIVEN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RHEA RIPLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SONYA DEVILLE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ZELINA VEGA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "WWE Women's Intercontinental Championship — RAW",
      "historial": [
        {
          "nombre": "LYRA VALKYRIA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Título Undisputed de la WWE — SmackDown",
      "historial": [
        {
          "nombre": "CODY RHODES",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ROMAN REIGNS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato de la WWE de Estados Unidos — SmackDown",
      "historial": [
        {
          "nombre": "JOHN CENA",
          "titulosJuego": 5,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AJ STYLES",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KEVIN OWENS",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KOFI KINGSTON",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REY MYSTERIO",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHEAMUS",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHINSUKE NAKAMURA",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AUSTIN THEORY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LA KNIGHT",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "R-TRUTH",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SETH \"FREAKIN\" ROLLINS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "THE MIZ",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ANDRADE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "APOLLO CREWS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BARON CORBIN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARLITO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DAMIAN PRIEST",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "FINN BÁLOR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LOGAN PAUL",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RANDY ORTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Femenino de la WWE",
      "historial": [
        {
          "nombre": "CHARLOTTE FLAIR",
          "titulosJuego": 6,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALEXA BLISS",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ASUKA",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BAYLEY",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BECKY LYNCH",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BIANCA BELAIR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NIA JAX",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IYO SKY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NIKKI CROSS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RHEA RIPLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TIFFANY STRATTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato de NXT",
      "historial": [
        {
          "nombre": "BRON BREAKKER",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "FINN BÁLOR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KARRION KROSS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHINSUKE NAKAMURA",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TOMMASO CIAMPA",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TRICK WILLIAMS",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ALEISTER BLACK",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ANDRADE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARMELO HAYES",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DREW McINTYRE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ETHAN PAGE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ILJA DRAGUNOV",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JOHNNY GARGANO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KEVIN OWENS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "OBA FEMI",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SAMI ZAYN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SETH \"FREAKIN\" ROLLINS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato de NXT de Norteamérica",
      "historial": [
        {
          "nombre": "JOHNNY GARGANO",
          "titulosJuego": 3,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "\"DIRTY\" DOMINIK MYSTERIO",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CARMELO HAYES",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRONSON REED",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DAMIAN PRIEST",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DRAGON LEE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "OBA FEMI",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHAWN SPEARS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SOLO SIKOA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TONY D'ANGELO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TRICK WILLIAMS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "WES LEE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato por Parejas de NXT",
      "historial": [
        {
          "nombre": "ANDRE CHASE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AXIOM",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHANNING \"STACKS\" LORENZO",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ELTON PRINCE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "GIOVANNI VINCI",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KIT WILSON",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LUDWIG KAISER",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "NATHAN FRAZER",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TONY D'ANGELO",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "WES LEE",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "AKAM",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ANGELO DAWKINS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BARON CORBIN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRON BREAKKER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BRUTUS CREED",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "CHAD GABLE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "DUKE HUDSON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ERIK",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IVAR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JOHNNY GARGANO",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "JULIUS CREED",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KOFI KINGSTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "MARK COFFEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "MONTEZ FORD",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "PETE DUNNE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "REZAR",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RIDGE HOLLAND",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TOMMASO CIAMPA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TYLER BATE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "WOLFGANG",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "XAVIER WOODS",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Femenino de NXT",
      "historial": [
        {
          "nombre": "CHARLOTTE FLAIR",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ROXANNE PEREZ",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "SHAYNA BASZLER",
          "titulosJuego": 2,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "ASUKA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BAYLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "BECKY LYNCH",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "GIULIA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "IYO SKY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KAIRI SANE",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "LYRA VALKYRIA",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RAQUEL RODRIGUEZ",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "RHEA RIPLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "TIFFANY STRATTON",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "Campeonato Femenino de NXT Norteamérica",
      "historial": [
        {
          "nombre": "FALLON HENLEY",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "KELANI JORDAN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        },
        {
          "nombre": "STEPHANIE VAQUER",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    },
    {
      "campeonato": "WWE Women's United States Championship",
      "historial": [
        {
          "nombre": "CHELSEA GREEN",
          "titulosJuego": 1,
          "wm2": null,
          "wm3": null,
          "wm4": null
        }
      ]
    }
  ],
  campeonesActuales :   [
    {
      "show": "🔴 RAW",
      "campeonato": "Campeonato Mundial de los Pesos Pesados (Campeonato principal)",
      "campeonActual": "GUNTHER",
      "diasReinado": null
    },
    {
      "show": "🔴 RAW",
      "campeonato": "Campeonato Intercontinental de la WWE (Campeonato secundario)",
      "campeonActual": "BRON BREAKKER",
      "diasReinado": null
    },
    {
      "show": "🔴 RAW",
      "campeonato": "Campeonato Mundial Femenino de la WWE (Campeonato femenino)",
      "campeonActual": "RHEA RIPLEY",
      "diasReinado": null
    },
    {
      "show": "🔴 RAW",
      "campeonato": "WWE Women's Intercontinental Championship (Campeonato femenino secundario)",
      "campeonActual": "LYRA VALKYRIA",
      "diasReinado": null
    },
    {
      "show": "🔴 RAW",
      "campeonato": "Título Mundial por Parejas (Parejas)",
      "campeonActual": "THE WAR RAIDERS",
      "diasReinado": null
    },
    {
      "show": "🔵 SmackDown",
      "campeonato": "Título Undisputed de la WWE (Campeonato principal)",
      "campeonActual": "CODY RHODES",
      "diasReinado": null
    },
    {
      "show": "🔵 SmackDown",
      "campeonato": "Campeonato de la WWE de Estados Unidos (Campeonato secundario)",
      "campeonActual": "SHINSUKE NAKAMURA",
      "diasReinado": null
    },
    {
      "show": "🔵 SmackDown",
      "campeonato": "Campeonato Femenino de la WWE (Campeonato femenino)",
      "campeonActual": "TIFFANY STRATTON",
      "diasReinado": null
    },
    {
      "show": "🔵 SmackDown",
      "campeonato": "WWE Women's United States Championship (Campeonato femenino secundario)",
      "campeonActual": "CHELSEA GREEN",
      "diasReinado": null
    },
    {
      "show": "🔵 SmackDown",
      "campeonato": "Título por Parejas de la WWE (Parejas)",
      "campeonActual": "#DIY",
      "diasReinado": null
    },
    {
      "show": "🟢 RAW y SmackDown",
      "campeonato": "Campeonato Femenino por Parejas de la WWE (Parejas femenino (compartido))",
      "campeonActual": "BIANCA BELAIR & NAOMI",
      "diasReinado": null
    },
    {
      "show": "🟡 NXT",
      "campeonato": "Campeonato de NXT (Campeonato máximo)",
      "campeonActual": "OBA FEMI",
      "diasReinado": null
    },
    {
      "show": "🟡 NXT",
      "campeonato": "Campeonato de NXT de Norteamérica (Campeonato secundario)",
      "campeonActual": "TONY D'ANGELO",
      "diasReinado": null
    },
    {
      "show": "🟡 NXT",
      "campeonato": "Campeonato Femenino de NXT (Femenino)",
      "campeonActual": "ROXANNE PEREZ",
      "diasReinado": null
    },
    {
      "show": "🟡 NXT",
      "campeonato": "Campeonato Femenino de NXT Norteamérica (Femenino secundario)",
      "campeonActual": "FALLON HENLEY",
      "diasReinado": null
    },
    {
      "show": "🟡 NXT",
      "campeonato": "Campeonato por Parejas de NXT (Parejas)",
      "campeonActual": "FRAXIOM",
      "diasReinado": null
    }
  ],
  comparacion2k26 :   [
    {
      "nombre": "Jazmyn Nyx",
      "show2k26": "NXT",
      "overall2k26": 72,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Wendy Choo",
      "show2k26": "NXT",
      "overall2k26": 72,
      "overall2k25": 72,
      "genero": "Mujer",
      "edadBase": 34
    },
    {
      "nombre": "Andre Chase",
      "show2k26": "NXT",
      "overall2k26": 73,
      "overall2k25": 73,
      "genero": "Hombre",
      "edadBase": 37
    },
    {
      "nombre": "Brooks Jensen",
      "show2k26": "NXT",
      "overall2k26": 73,
      "overall2k25": 73,
      "genero": "Hombre",
      "edadBase": 25
    },
    {
      "nombre": "Nikkita Lyons",
      "show2k26": "NXT",
      "overall2k26": 73,
      "overall2k25": 83,
      "genero": "Mujer",
      "edadBase": 27
    },
    {
      "nombre": "Channing \"Stacks\" Lorenzo",
      "show2k26": "NXT",
      "overall2k26": 74,
      "overall2k25": 72,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Josh Briggs",
      "show2k26": "NXT",
      "overall2k26": 74,
      "overall2k25": 74,
      "genero": "Hombre",
      "edadBase": 33
    },
    {
      "nombre": "Lexis King",
      "show2k26": "NXT",
      "overall2k26": 74,
      "overall2k25": 74,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Ridge Holland",
      "show2k26": "NXT",
      "overall2k26": 74,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 38
    },
    {
      "nombre": "Wren Sinclair",
      "show2k26": "NXT",
      "overall2k26": 74,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Charlie Dempsey",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": 75,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Myles Borne",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Shawn Spears",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": 73,
      "genero": "Hombre",
      "edadBase": 45
    },
    {
      "nombre": "Yoshiki Inamura",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Karmen Petrovic",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Tatum Paxley",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": 73,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "Thea Hail",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": 74,
      "genero": "Mujer",
      "edadBase": 22
    },
    {
      "nombre": "Zaria",
      "show2k26": "NXT",
      "overall2k26": 75,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Noam Dar",
      "show2k26": "NXT",
      "overall2k26": 76,
      "overall2k25": 76,
      "genero": "Hombre",
      "edadBase": 33
    },
    {
      "nombre": "Tavion Heights",
      "show2k26": "NXT",
      "overall2k26": 76,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Izzi Dame",
      "show2k26": "NXT",
      "overall2k26": 76,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Hank Walker",
      "show2k26": "NXT",
      "overall2k26": 77,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Tank Ledger",
      "show2k26": "NXT",
      "overall2k26": 77,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Jaida Parker",
      "show2k26": "NXT",
      "overall2k26": 77,
      "overall2k25": 75,
      "genero": "Mujer",
      "edadBase": 27
    },
    {
      "nombre": "Sol Ruca",
      "show2k26": "NXT",
      "overall2k26": 77,
      "overall2k25": 80,
      "genero": "Mujer",
      "edadBase": 26
    },
    {
      "nombre": "Blake Monroe",
      "show2k26": "NXT",
      "overall2k26": 78,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Fallon Henley",
      "show2k26": "NXT",
      "overall2k26": 78,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 31
    },
    {
      "nombre": "Lola Vice",
      "show2k26": "NXT",
      "overall2k26": 78,
      "overall2k25": 75,
      "genero": "Mujer",
      "edadBase": 28
    },
    {
      "nombre": "Tony D'Angelo",
      "show2k26": "NXT",
      "overall2k26": 79,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 31
    },
    {
      "nombre": "Kelani Jordan",
      "show2k26": "NXT",
      "overall2k26": 79,
      "overall2k25": 75,
      "genero": "Mujer",
      "edadBase": 27
    },
    {
      "nombre": "Joe Hendry DLC",
      "show2k26": "NXT",
      "overall2k26": 80,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Jacy Jayne",
      "show2k26": "NXT",
      "overall2k26": 80,
      "overall2k25": 75,
      "genero": "Mujer",
      "edadBase": 30
    },
    {
      "nombre": "Ricky Saints",
      "show2k26": "NXT",
      "overall2k26": 81,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Ethan Page",
      "show2k26": "NXT",
      "overall2k26": 83,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Oba Femi",
      "show2k26": "NXT",
      "overall2k26": 85,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 28
    },
    {
      "nombre": "Akira Tozawa",
      "show2k26": "RAW",
      "overall2k26": 68,
      "overall2k25": 68,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Joaquin Wilde",
      "show2k26": "RAW",
      "overall2k26": 72,
      "overall2k25": 68,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "Cruz Del Toro",
      "show2k26": "RAW",
      "overall2k26": 73,
      "overall2k25": 69,
      "genero": "Hombre",
      "edadBase": 34
    },
    {
      "nombre": "Grayson Waller",
      "show2k26": "RAW",
      "overall2k26": 73,
      "overall2k25": 74,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Otis",
      "show2k26": "RAW",
      "overall2k26": 75,
      "overall2k25": 75,
      "genero": "Hombre",
      "edadBase": 34
    },
    {
      "nombre": "Pete Dunne",
      "show2k26": "RAW",
      "overall2k26": 76,
      "overall2k25": 76,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Tyler Bate",
      "show2k26": "RAW",
      "overall2k26": 76,
      "overall2k25": 76,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Ivy Nile",
      "show2k26": "RAW",
      "overall2k26": 76,
      "overall2k25": 76,
      "genero": "Mujer",
      "edadBase": 34
    },
    {
      "nombre": "Brutus Creed",
      "show2k26": "RAW",
      "overall2k26": 77,
      "overall2k25": 76,
      "genero": "Hombre",
      "edadBase": 30
    },
    {
      "nombre": "Ludwig Kaiser",
      "show2k26": "RAW",
      "overall2k26": 77,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Erik",
      "show2k26": "RAW",
      "overall2k26": 78,
      "overall2k25": 83,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Je'Von Evans",
      "show2k26": "RAW",
      "overall2k26": 78,
      "overall2k25": 77,
      "genero": "Hombre",
      "edadBase": 22
    },
    {
      "nombre": "Julius Creed",
      "show2k26": "RAW",
      "overall2k26": 78,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 31
    },
    {
      "nombre": "Maxxine Dupri",
      "show2k26": "RAW",
      "overall2k26": 78,
      "overall2k25": 67,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "Dragon Lee",
      "show2k26": "RAW",
      "overall2k26": 79,
      "overall2k25": 88,
      "genero": "Hombre",
      "edadBase": 31
    },
    {
      "nombre": "Ivar",
      "show2k26": "RAW",
      "overall2k26": 79,
      "overall2k25": 83,
      "genero": "Hombre",
      "edadBase": 42
    },
    {
      "nombre": "JD McDonagh",
      "show2k26": "RAW",
      "overall2k26": 79,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Pat McAfee",
      "show2k26": "RAW",
      "overall2k26": 80,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Zoey Stark",
      "show2k26": "RAW",
      "overall2k26": 80,
      "overall2k25": 78,
      "genero": "Mujer",
      "edadBase": 32
    },
    {
      "nombre": "Chad Gable",
      "show2k26": "RAW",
      "overall2k26": 81,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 40
    },
    {
      "nombre": "Austin Theory",
      "show2k26": "RAW",
      "overall2k26": 82,
      "overall2k25": 87,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Xavier Woods",
      "show2k26": "RAW",
      "overall2k26": 82,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "Kofi Kingston",
      "show2k26": "RAW",
      "overall2k26": 83,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 45
    },
    {
      "nombre": "Rusev",
      "show2k26": "RAW",
      "overall2k26": 83,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Penta",
      "show2k26": "RAW",
      "overall2k26": 84,
      "overall2k25": 88,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Kairi Sane",
      "show2k26": "RAW",
      "overall2k26": 84,
      "overall2k25": 81,
      "genero": "Mujer",
      "edadBase": 37
    },
    {
      "nombre": "Lyra Valkyria",
      "show2k26": "RAW",
      "overall2k26": 84,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "El Grande Americano",
      "show2k26": "RAW",
      "overall2k26": 85,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "El Grande Americano Original",
      "show2k26": "RAW",
      "overall2k26": 85,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Rey Mysterio",
      "show2k26": "RAW",
      "overall2k26": 85,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 51
    },
    {
      "nombre": "Roxanne Perez",
      "show2k26": "RAW",
      "overall2k26": 85,
      "overall2k25": 91,
      "genero": "Mujer",
      "edadBase": 24
    },
    {
      "nombre": "Jimmy Uso",
      "show2k26": "RAW",
      "overall2k26": 86,
      "overall2k25": 85,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Sheamus",
      "show2k26": "RAW",
      "overall2k26": 86,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 48
    },
    {
      "nombre": "Natalya",
      "show2k26": "RAW",
      "overall2k26": 86,
      "overall2k25": 78,
      "genero": "Mujer",
      "edadBase": 44
    },
    {
      "nombre": "Raquel Rodriguez",
      "show2k26": "RAW",
      "overall2k26": 86,
      "overall2k25": 90,
      "genero": "Mujer",
      "edadBase": 35
    },
    {
      "nombre": "Dominik Mysterio",
      "show2k26": "RAW",
      "overall2k26": 87,
      "overall2k25": 86,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "AJ Lee",
      "show2k26": "RAW",
      "overall2k26": 87,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "AJ Styles",
      "show2k26": "RAW",
      "overall2k26": 88,
      "overall2k25": 85,
      "genero": "Hombre",
      "edadBase": 49
    },
    {
      "nombre": "Bronson Reed",
      "show2k26": "RAW",
      "overall2k26": 88,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 37
    },
    {
      "nombre": "Finn Bálor",
      "show2k26": "RAW",
      "overall2k26": 88,
      "overall2k25": 87,
      "genero": "Hombre",
      "edadBase": 45
    },
    {
      "nombre": "Nikki Bella",
      "show2k26": "RAW",
      "overall2k26": 88,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "LA Knight",
      "show2k26": "RAW",
      "overall2k26": 89,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 43
    },
    {
      "nombre": "Bayley",
      "show2k26": "RAW",
      "overall2k26": 89,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 37
    },
    {
      "nombre": "Bron Breakker",
      "show2k26": "RAW",
      "overall2k26": 90,
      "overall2k25": 92,
      "genero": "Hombre",
      "edadBase": 28
    },
    {
      "nombre": "Logan Paul",
      "show2k26": "RAW",
      "overall2k26": 90,
      "overall2k25": 96,
      "genero": "Hombre",
      "edadBase": 31
    },
    {
      "nombre": "Jey Uso",
      "show2k26": "RAW",
      "overall2k26": 91,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Asuka",
      "show2k26": "RAW",
      "overall2k26": 91,
      "overall2k25": 83,
      "genero": "Mujer",
      "edadBase": 44
    },
    {
      "nombre": "Liv Morgan",
      "show2k26": "RAW",
      "overall2k26": 92,
      "overall2k25": 95,
      "genero": "Mujer",
      "edadBase": 32
    },
    {
      "nombre": "Naomi",
      "show2k26": "RAW",
      "overall2k26": 92,
      "overall2k25": 85,
      "genero": "Mujer",
      "edadBase": 38
    },
    {
      "nombre": "Stephanie Vaquer",
      "show2k26": "RAW",
      "overall2k26": 92,
      "overall2k25": 89,
      "genero": "Mujer",
      "edadBase": 33
    },
    {
      "nombre": "Gunther",
      "show2k26": "RAW",
      "overall2k26": 93,
      "overall2k25": 92,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "IYO SKY",
      "show2k26": "RAW",
      "overall2k26": 93,
      "overall2k25": 93,
      "genero": "Mujer",
      "edadBase": 36
    },
    {
      "nombre": "CM Punk",
      "show2k26": "RAW",
      "overall2k26": 94,
      "overall2k25": 92,
      "genero": "Hombre",
      "edadBase": 47
    },
    {
      "nombre": "Seth Rollins",
      "show2k26": "RAW",
      "overall2k26": 94,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Becky Lynch",
      "show2k26": "RAW",
      "overall2k26": 94,
      "overall2k25": 96,
      "genero": "Mujer",
      "edadBase": 39
    },
    {
      "nombre": "Rhea Ripley",
      "show2k26": "RAW",
      "overall2k26": 96,
      "overall2k25": 96,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "B-Fab",
      "show2k26": "SmackDown",
      "overall2k26": 67,
      "overall2k25": 64,
      "genero": "Mujer",
      "edadBase": 35
    },
    {
      "nombre": "Apollo Crews",
      "show2k26": "SmackDown",
      "overall2k26": 70,
      "overall2k25": 71,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "Elton Prince",
      "show2k26": "SmackDown",
      "overall2k26": 71,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Angel",
      "show2k26": "SmackDown",
      "overall2k26": 72,
      "overall2k25": 72,
      "genero": "Hombre",
      "edadBase": 33
    },
    {
      "nombre": "Berto",
      "show2k26": "SmackDown",
      "overall2k26": 72,
      "overall2k25": 71,
      "genero": "Hombre",
      "edadBase": 30
    },
    {
      "nombre": "Candice LeRae",
      "show2k26": "SmackDown",
      "overall2k26": 73,
      "overall2k25": 73,
      "genero": "Mujer",
      "edadBase": 40
    },
    {
      "nombre": "Kiana James",
      "show2k26": "SmackDown",
      "overall2k26": 73,
      "overall2k25": 72,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "Nikki Cross",
      "show2k26": "SmackDown",
      "overall2k26": 73,
      "overall2k25": 73,
      "genero": "Mujer",
      "edadBase": 37
    },
    {
      "nombre": "Kit Wilson",
      "show2k26": "SmackDown",
      "overall2k26": 74,
      "overall2k25": 71,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Axiom",
      "show2k26": "SmackDown",
      "overall2k26": 75,
      "overall2k25": 75,
      "genero": "Hombre",
      "edadBase": 29
    },
    {
      "nombre": "Johnny Gargano",
      "show2k26": "SmackDown",
      "overall2k26": 76,
      "overall2k25": 76,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "Nathan Frazer",
      "show2k26": "SmackDown",
      "overall2k26": 76,
      "overall2k25": 75,
      "genero": "Hombre",
      "edadBase": 28
    },
    {
      "nombre": "Santos Escobar",
      "show2k26": "SmackDown",
      "overall2k26": 76,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 42
    },
    {
      "nombre": "Talla Tonga",
      "show2k26": "SmackDown",
      "overall2k26": 77,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Tommaso Ciampa",
      "show2k26": "SmackDown",
      "overall2k26": 77,
      "overall2k25": 77,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Alba Fyre",
      "show2k26": "SmackDown",
      "overall2k26": 77,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 34
    },
    {
      "nombre": "Angelo Dawkins",
      "show2k26": "SmackDown",
      "overall2k26": 78,
      "overall2k25": 75,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Rey Fenix",
      "show2k26": "SmackDown",
      "overall2k26": 78,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Tonga Loa",
      "show2k26": "SmackDown",
      "overall2k26": 79,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 43
    },
    {
      "nombre": "Piper Niven",
      "show2k26": "SmackDown",
      "overall2k26": 79,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 35
    },
    {
      "nombre": "Alex Shelley",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 43
    },
    {
      "nombre": "Chris Sabin",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 44
    },
    {
      "nombre": "Erick Rowan",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 44
    },
    {
      "nombre": "Montez Ford",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 78,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "R-Truth",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 71,
      "genero": "Hombre",
      "edadBase": 54
    },
    {
      "nombre": "The Miz",
      "show2k26": "SmackDown",
      "overall2k26": 80,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 45
    },
    {
      "nombre": "Jordynne Grace",
      "show2k26": "SmackDown",
      "overall2k26": 81,
      "overall2k25": 77,
      "genero": "Mujer",
      "edadBase": 30
    },
    {
      "nombre": "Lash Legend",
      "show2k26": "SmackDown",
      "overall2k26": 81,
      "overall2k25": 78,
      "genero": "Mujer",
      "edadBase": 29
    },
    {
      "nombre": "Dexter Lumis",
      "show2k26": "SmackDown",
      "overall2k26": 82,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 42
    },
    {
      "nombre": "JC Mateo",
      "show2k26": "SmackDown",
      "overall2k26": 82,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Joe Gacy",
      "show2k26": "SmackDown",
      "overall2k26": 82,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 39
    },
    {
      "nombre": "Matt Cardona DLC",
      "show2k26": "SmackDown",
      "overall2k26": 82,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Michin",
      "show2k26": "SmackDown",
      "overall2k26": 82,
      "overall2k25": 80,
      "genero": "Mujer",
      "edadBase": 37
    },
    {
      "nombre": "Tama Tonga",
      "show2k26": "SmackDown",
      "overall2k26": 83,
      "overall2k25": 83,
      "genero": "Hombre",
      "edadBase": 43
    },
    {
      "nombre": "Zelina",
      "show2k26": "SmackDown",
      "overall2k26": 83,
      "overall2k25": null,
      "genero": null,
      "edadBase": null
    },
    {
      "nombre": "Aleister Black",
      "show2k26": "SmackDown",
      "overall2k26": 84,
      "overall2k25": 82,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Carmelo Hayes",
      "show2k26": "SmackDown",
      "overall2k26": 84,
      "overall2k25": 81,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Trick Williams",
      "show2k26": "SmackDown",
      "overall2k26": 84,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Ilja Dragunov",
      "show2k26": "SmackDown",
      "overall2k26": 85,
      "overall2k25": 80,
      "genero": "Hombre",
      "edadBase": 32
    },
    {
      "nombre": "Solo Sikoa",
      "show2k26": "SmackDown",
      "overall2k26": 85,
      "overall2k25": 88,
      "genero": "Hombre",
      "edadBase": 33
    },
    {
      "nombre": "Chelsea Green",
      "show2k26": "SmackDown",
      "overall2k26": 85,
      "overall2k25": 80,
      "genero": "Mujer",
      "edadBase": 35
    },
    {
      "nombre": "Shinsuke Nakamura",
      "show2k26": "SmackDown",
      "overall2k26": 86,
      "overall2k25": 87,
      "genero": "Hombre",
      "edadBase": 46
    },
    {
      "nombre": "Giulia",
      "show2k26": "SmackDown",
      "overall2k26": 86,
      "overall2k25": 82,
      "genero": "Mujer",
      "edadBase": 32
    },
    {
      "nombre": "Damian Priest",
      "show2k26": "SmackDown",
      "overall2k26": 87,
      "overall2k25": 86,
      "genero": "Hombre",
      "edadBase": 43
    },
    {
      "nombre": "Kevin Owens",
      "show2k26": "SmackDown",
      "overall2k26": 87,
      "overall2k25": 87,
      "genero": "Hombre",
      "edadBase": 42
    },
    {
      "nombre": "Uncle Howdy",
      "show2k26": "SmackDown",
      "overall2k26": 87,
      "overall2k25": 87,
      "genero": "Hombre",
      "edadBase": 36
    },
    {
      "nombre": "Alexa Bliss",
      "show2k26": "SmackDown",
      "overall2k26": 87,
      "overall2k25": 83,
      "genero": "Mujer",
      "edadBase": 35
    },
    {
      "nombre": "Jacob Fatu",
      "show2k26": "SmackDown",
      "overall2k26": 88,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 34
    },
    {
      "nombre": "Jade Cargill",
      "show2k26": "SmackDown",
      "overall2k26": 88,
      "overall2k25": 86,
      "genero": "Mujer",
      "edadBase": 34
    },
    {
      "nombre": "Nia Jax",
      "show2k26": "SmackDown",
      "overall2k26": 88,
      "overall2k25": 88,
      "genero": "Mujer",
      "edadBase": 42
    },
    {
      "nombre": "Sami Zayn",
      "show2k26": "SmackDown",
      "overall2k26": 89,
      "overall2k25": 79,
      "genero": "Hombre",
      "edadBase": 42
    },
    {
      "nombre": "Tiffany Stratton",
      "show2k26": "SmackDown",
      "overall2k26": 91,
      "overall2k25": 85,
      "genero": "Mujer",
      "edadBase": 27
    },
    {
      "nombre": "Randy Orton",
      "show2k26": "SmackDown",
      "overall2k26": 92,
      "overall2k25": 92,
      "genero": "Hombre",
      "edadBase": 46
    },
    {
      "nombre": "Drew McIntyre",
      "show2k26": "SmackDown",
      "overall2k26": 93,
      "overall2k25": 91,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Charlotte Flair",
      "show2k26": "SmackDown",
      "overall2k26": 93,
      "overall2k25": 92,
      "genero": "Mujer",
      "edadBase": 40
    },
    {
      "nombre": "Bianca Belair",
      "show2k26": "SmackDown",
      "overall2k26": 94,
      "overall2k25": 95,
      "genero": "Mujer",
      "edadBase": 37
    },
    {
      "nombre": "Cody Rhodes",
      "show2k26": "SmackDown",
      "overall2k26": 95,
      "overall2k25": 96,
      "genero": "Hombre",
      "edadBase": 41
    },
    {
      "nombre": "Roman Reigns",
      "show2k26": "SmackDown",
      "overall2k26": 95,
      "overall2k25": 96,
      "genero": "Hombre",
      "edadBase": 41
    }
  ]
};
