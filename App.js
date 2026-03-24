import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "./supabase";

const APP_NAME = "X-pand Limits";
const BG = require("./assets/images/lightning-realistic.jpg");

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps"];
const EQUIPMENT = ["Dumbbell", "Barbell", "Cable", "Machine"];
const LANGUAGES = [
  { code: "system", label: "System" },
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "pl", label: "Polski" },
  { code: "ro", label: "Română" },
  { code: "cs", label: "Čeština" },
  { code: "sv", label: "Svenska" },
  { code: "da", label: "Dansk" },
  { code: "no", label: "Norsk" },
  { code: "fi", label: "Suomi" },
  { code: "el", label: "Ελληνικά" },
  { code: "hu", label: "Magyar" },
  { code: "uk", label: "Українська" },
  { code: "ru", label: "Русский" },
];

const STRINGS = {
  en: {
    signIn: "Sign in",
    email: "Email",
    password: "Password",
    continueEmail: "Continue with email",
    continueApple: "Continue with Apple",
    continueGoogle: "Continue with Google",
    continueX: "Continue with X",
    sessions: "Sessions",
    addSession: "Add session",
    addExercise: "Add exercise",
    settings: "Settings",
    profile: "Profile",
    appInfo: "App info",
    privacy: "Privacy statement",
    language: "Language",
    systemDefault: "System default",
    save: "Save",
    cancel: "Cancel",
    selectGroups: "Select main groups",
    noSessions: "No sessions yet",
    noExercises: "No exercises yet",
    exercises: "Exercises",
    back: "Back",
    weight: "Weight",
    reps: "Reps",
    equipment: "Equipment",
    searchExercise: "Search exercise",
    add: "Add",
    editSession: "Edit session",
    createSession: "Create session",
    createExercise: "Create exercise",
    chooseEquipment: "Choose equipment first",
    information: "Information",
    howTo: "How to",
    tips: "Tips & tricks",
    remove: "Remove",
    loginHint: "Sign in to sync your sessions",
    selectedLanguage: "Selected language",
    sessionsCount: "sessions",
    done: "Done",
    weightUnit: "Weight unit",
    kilograms: "Kg",
    pounds: "Lbs",
    signOut: "Sign out",
  },
  nl: {
    signIn: "Inloggen",
    email: "E-mail",
    password: "Wachtwoord",
    continueEmail: "Doorgaan met e-mail",
    continueApple: "Doorgaan met Apple",
    continueGoogle: "Doorgaan met Google",
    continueX: "Doorgaan met X",
    sessions: "Sessies",
    addSession: "Sessie toevoegen",
    addExercise: "Oefening toevoegen",
    settings: "Instellingen",
    profile: "Profiel",
    appInfo: "App-info",
    privacy: "Privacyverklaring",
    language: "Taal",
    systemDefault: "Systeemstandaard",
    save: "Opslaan",
    cancel: "Annuleren",
    selectGroups: "Kies hoofdgroepen",
    noSessions: "Nog geen sessies",
    noExercises: "Nog geen oefeningen",
    exercises: "Oefeningen",
    back: "Terug",
    weight: "Gewicht",
    reps: "Herhalingen",
    equipment: "Materiaal",
    searchExercise: "Zoek oefening",
    add: "Toevoegen",
    editSession: "Sessie bewerken",
    createSession: "Sessie maken",
    createExercise: "Oefening maken",
    chooseEquipment: "Kies eerst materiaal",
    information: "Info",
    howTo: "Uitvoering",
    tips: "Tips & tricks",
    remove: "Verwijderen",
    loginHint: "Log in om je sessies te synchroniseren",
    selectedLanguage: "Geselecteerde taal",
    sessionsCount: "sessies",
    done: "Klaar",
  },
  de: {
    signIn: "Anmelden",
    email: "E-Mail",
    password: "Passwort",
    continueEmail: "Mit E-Mail fortfahren",
    continueApple: "Mit Apple fortfahren",
    continueGoogle: "Mit Google fortfahren",
    continueX: "Mit X fortfahren",
    sessions: "Einheiten",
    addSession: "Einheit hinzufügen",
    addExercise: "Übung hinzufügen",
    settings: "Einstellungen",
    profile: "Profil",
    appInfo: "App-Info",
    privacy: "Datenschutzerklärung",
    language: "Sprache",
    systemDefault: "Systemstandard",
    save: "Speichern",
    cancel: "Abbrechen",
    selectGroups: "Hauptgruppen wählen",
    noSessions: "Noch keine Einheiten",
    noExercises: "Noch keine Übungen",
    exercises: "Übungen",
    back: "Zurück",
    weight: "Gewicht",
    reps: "Wiederholungen",
    equipment: "Gerät",
    searchExercise: "Übung suchen",
    add: "Hinzufügen",
    editSession: "Einheit bearbeiten",
    createSession: "Einheit erstellen",
    createExercise: "Übung erstellen",
    chooseEquipment: "Zuerst Gerät wählen",
    information: "Info",
    howTo: "Ausführung",
    tips: "Tipps & Tricks",
    remove: "Löschen",
    loginHint: "Vorläufiger Dummy-Login",
    selectedLanguage: "Ausgewählte Sprache",
    sessionsCount: "Einheiten",
    done: "Fertig",
  },
  fr: {
    signIn: "Se connecter",
    email: "E-mail",
    password: "Mot de passe",
    continueEmail: "Continuer avec l’e-mail",
    continueApple: "Continuer avec Apple",
    continueGoogle: "Continuer avec Google",
    continueX: "Continuer avec X",
    sessions: "Séances",
    addSession: "Ajouter une séance",
    addExercise: "Ajouter un exercice",
    settings: "Réglages",
    profile: "Profil",
    appInfo: "Infos app",
    privacy: "Déclaration de confidentialité",
    language: "Langue",
    systemDefault: "Système",
    save: "Enregistrer",
    cancel: "Annuler",
    selectGroups: "Choisir les groupes principaux",
    noSessions: "Aucune séance",
    noExercises: "Aucun exercice",
    exercises: "Exercices",
    back: "Retour",
    weight: "Poids",
    reps: "Répétitions",
    equipment: "Équipement",
    searchExercise: "Rechercher un exercice",
    add: "Ajouter",
    editSession: "Modifier la séance",
    createSession: "Créer une séance",
    createExercise: "Créer un exercice",
    chooseEquipment: "Choisissez d’abord l’équipement",
    information: "Info",
    howTo: "Comment faire",
    tips: "Astuces",
    remove: "Supprimer",
    loginHint: "Connexion factice pour l’instant",
    selectedLanguage: "Langue sélectionnée",
    sessionsCount: "séances",
    done: "Terminé",
  },
  es: {
    signIn: "Iniciar sesión",
    email: "Correo",
    password: "Contraseña",
    continueEmail: "Continuar con correo",
    continueApple: "Continuar con Apple",
    continueGoogle: "Continuar con Google",
    continueX: "Continuar con X",
    sessions: "Sesiones",
    addSession: "Añadir sesión",
    addExercise: "Añadir ejercicio",
    settings: "Ajustes",
    profile: "Perfil",
    appInfo: "Info de la app",
    privacy: "Declaración de privacidad",
    language: "Idioma",
    systemDefault: "Predeterminado del sistema",
    save: "Guardar",
    cancel: "Cancelar",
    selectGroups: "Selecciona grupos principales",
    noSessions: "Aún no hay sesiones",
    noExercises: "Aún no hay ejercicios",
    exercises: "Ejercicios",
    back: "Atrás",
    weight: "Peso",
    reps: "Repeticiones",
    equipment: "Equipo",
    searchExercise: "Buscar ejercicio",
    add: "Añadir",
    editSession: "Editar sesión",
    createSession: "Crear sesión",
    createExercise: "Crear ejercicio",
    chooseEquipment: "Primero elige equipo",
    information: "Info",
    howTo: "Cómo hacerlo",
    tips: "Consejos",
    remove: "Eliminar",
    loginHint: "Inicio de sesión ficticio por ahora",
    selectedLanguage: "Idioma seleccionado",
    sessionsCount: "sesiones",
    done: "Hecho",
  },
  it: {
    signIn: "Accedi",
    email: "E-mail",
    password: "Password",
    continueEmail: "Continua con e-mail",
    continueApple: "Continua con Apple",
    continueGoogle: "Continua con Google",
    continueX: "Continua con X",
    sessions: "Sessioni",
    addSession: "Aggiungi sessione",
    addExercise: "Aggiungi esercizio",
    settings: "Impostazioni",
    profile: "Profilo",
    appInfo: "Info app",
    privacy: "Informativa sulla privacy",
    language: "Lingua",
    systemDefault: "Predefinita di sistema",
    save: "Salva",
    cancel: "Annulla",
    selectGroups: "Seleziona gruppi principali",
    noSessions: "Nessuna sessione",
    noExercises: "Nessun esercizio",
    exercises: "Esercizi",
    back: "Indietro",
    weight: "Peso",
    reps: "Ripetizioni",
    equipment: "Attrezzatura",
    searchExercise: "Cerca esercizio",
    add: "Aggiungi",
    editSession: "Modifica sessione",
    createSession: "Crea sessione",
    createExercise: "Crea esercizio",
    chooseEquipment: "Scegli prima l’attrezzatura",
    information: "Info",
    howTo: "Esecuzione",
    tips: "Suggerimenti",
    remove: "Rimuovi",
    loginHint: "Accesso fittizio per ora",
    selectedLanguage: "Lingua selezionata",
    sessionsCount: "sessioni",
    done: "Fatto",
  },
  pt: {
    signIn: "Entrar",
    email: "E-mail",
    password: "Senha",
    continueEmail: "Continuar com e-mail",
    continueApple: "Continuar com Apple",
    continueGoogle: "Continuar com Google",
    continueX: "Continuar com X",
    sessions: "Sessões",
    addSession: "Adicionar sessão",
    addExercise: "Adicionar exercício",
    settings: "Definições",
    profile: "Perfil",
    appInfo: "Info da app",
    privacy: "Declaração de privacidade",
    language: "Idioma",
    systemDefault: "Padrão do sistema",
    save: "Guardar",
    cancel: "Cancelar",
    selectGroups: "Selecionar grupos principais",
    noSessions: "Ainda sem sessões",
    noExercises: "Ainda sem exercícios",
    exercises: "Exercícios",
    back: "Voltar",
    weight: "Peso",
    reps: "Repetições",
    equipment: "Equipamento",
    searchExercise: "Procurar exercício",
    add: "Adicionar",
    editSession: "Editar sessão",
    createSession: "Criar sessão",
    createExercise: "Criar exercício",
    chooseEquipment: "Escolha primeiro o equipamento",
    information: "Info",
    howTo: "Como fazer",
    tips: "Dicas",
    remove: "Remover",
    loginHint: "Login fictício por enquanto",
    selectedLanguage: "Idioma selecionado",
    sessionsCount: "sessões",
    done: "Feito",
  },
  pl: {
    signIn: "Zaloguj się",
    email: "E-mail",
    password: "Hasło",
    continueEmail: "Kontynuuj przez e-mail",
    continueApple: "Kontynuuj z Apple",
    continueGoogle: "Kontynuuj z Google",
    continueX: "Kontynuuj z X",
    sessions: "Sesje",
    addSession: "Dodaj sesję",
    addExercise: "Dodaj ćwiczenie",
    settings: "Ustawienia",
    profile: "Profil",
    appInfo: "Informacje o aplikacji",
    privacy: "Polityka prywatności",
    language: "Język",
    systemDefault: "Domyślny systemowy",
    save: "Zapisz",
    cancel: "Anuluj",
    selectGroups: "Wybierz główne grupy",
    noSessions: "Brak sesji",
    noExercises: "Brak ćwiczeń",
    exercises: "Ćwiczenia",
    back: "Wstecz",
    weight: "Ciężar",
    reps: "Powtórzenia",
    equipment: "Sprzęt",
    searchExercise: "Szukaj ćwiczenia",
    add: "Dodaj",
    editSession: "Edytuj sesję",
    createSession: "Utwórz sesję",
    createExercise: "Utwórz ćwiczenie",
    chooseEquipment: "Najpierw wybierz sprzęt",
    information: "Informacje",
    howTo: "Jak wykonać",
    tips: "Wskazówki",
    remove: "Usuń",
    loginHint: "Na razie fikcyjne logowanie",
    selectedLanguage: "Wybrany język",
    sessionsCount: "sesji",
    done: "Gotowe",
  },
  ro: {
    signIn: "Autentificare",
    email: "E-mail",
    password: "Parolă",
    continueEmail: "Continuă cu e-mail",
    continueApple: "Continuă cu Apple",
    continueGoogle: "Continuă cu Google",
    continueX: "Continuă cu X",
    sessions: "Sesiuni",
    addSession: "Adaugă sesiune",
    addExercise: "Adaugă exercițiu",
    settings: "Setări",
    profile: "Profil",
    appInfo: "Info aplicație",
    privacy: "Politica de confidențialitate",
    language: "Limbă",
    systemDefault: "Implicit sistem",
    save: "Salvează",
    cancel: "Anulează",
    selectGroups: "Selectează grupele principale",
    noSessions: "Nicio sesiune",
    noExercises: "Niciun exercițiu",
    exercises: "Exerciții",
    back: "Înapoi",
    weight: "Greutate",
    reps: "Repetări",
    equipment: "Echipament",
    searchExercise: "Caută exercițiu",
    add: "Adaugă",
    editSession: "Editează sesiunea",
    createSession: "Creează sesiune",
    createExercise: "Creează exercițiu",
    chooseEquipment: "Alege mai întâi echipamentul",
    information: "Info",
    howTo: "Cum se face",
    tips: "Sfaturi",
    remove: "Șterge",
    loginHint: "Autentificare demo pentru moment",
    selectedLanguage: "Limba selectată",
    sessionsCount: "sesiuni",
    done: "Gata",
  },
  cs: {
    signIn: "Přihlásit se",
    email: "E-mail",
    password: "Heslo",
    continueEmail: "Pokračovat e-mailem",
    continueApple: "Pokračovat s Apple",
    continueGoogle: "Pokračovat s Google",
    continueX: "Pokračovat s X",
    sessions: "Tréninky",
    addSession: "Přidat trénink",
    addExercise: "Přidat cvik",
    settings: "Nastavení",
    profile: "Profil",
    appInfo: "Informace o aplikaci",
    privacy: "Prohlášení o ochraně soukromí",
    language: "Jazyk",
    systemDefault: "Výchozí systémový",
    save: "Uložit",
    cancel: "Zrušit",
    selectGroups: "Vyberte hlavní partie",
    noSessions: "Zatím žádné tréninky",
    noExercises: "Zatím žádné cviky",
    exercises: "Cviky",
    back: "Zpět",
    weight: "Váha",
    reps: "Opakování",
    equipment: "Vybavení",
    searchExercise: "Hledat cvik",
    add: "Přidat",
    editSession: "Upravit trénink",
    createSession: "Vytvořit trénink",
    createExercise: "Vytvořit cvik",
    chooseEquipment: "Nejprve vyberte vybavení",
    information: "Info",
    howTo: "Jak na to",
    tips: "Tipy",
    remove: "Odstranit",
    loginHint: "Prozatím ukázkové přihlášení",
    selectedLanguage: "Vybraný jazyk",
    sessionsCount: "tréninků",
    done: "Hotovo",
  },
  sv: {
    signIn: "Logga in",
    email: "E-post",
    password: "Lösenord",
    continueEmail: "Fortsätt med e-post",
    continueApple: "Fortsätt med Apple",
    continueGoogle: "Fortsätt med Google",
    continueX: "Fortsätt med X",
    sessions: "Pass",
    addSession: "Lägg till pass",
    addExercise: "Lägg till övning",
    settings: "Inställningar",
    profile: "Profil",
    appInfo: "Appinfo",
    privacy: "Integritetspolicy",
    language: "Språk",
    systemDefault: "Systemstandard",
    save: "Spara",
    cancel: "Avbryt",
    selectGroups: "Välj huvudgrupper",
    noSessions: "Inga pass ännu",
    noExercises: "Inga övningar ännu",
    exercises: "Övningar",
    back: "Tillbaka",
    weight: "Vikt",
    reps: "Reps",
    equipment: "Utrustning",
    searchExercise: "Sök övning",
    add: "Lägg till",
    editSession: "Redigera pass",
    createSession: "Skapa pass",
    createExercise: "Skapa övning",
    chooseEquipment: "Välj utrustning först",
    information: "Info",
    howTo: "Hur man gör",
    tips: "Tips & tricks",
    remove: "Ta bort",
    loginHint: "Dummy-inloggning för tillfället",
    selectedLanguage: "Valt språk",
    sessionsCount: "pass",
    done: "Klart",
  },
  da: {
    signIn: "Log ind",
    email: "E-mail",
    password: "Adgangskode",
    continueEmail: "Fortsæt med e-mail",
    continueApple: "Fortsæt med Apple",
    continueGoogle: "Fortsæt med Google",
    continueX: "Fortsæt med X",
    sessions: "Sessioner",
    addSession: "Tilføj session",
    addExercise: "Tilføj øvelse",
    settings: "Indstillinger",
    profile: "Profil",
    appInfo: "Appinfo",
    privacy: "Privatlivserklæring",
    language: "Sprog",
    systemDefault: "Systemstandard",
    save: "Gem",
    cancel: "Annuller",
    selectGroups: "Vælg hovedgrupper",
    noSessions: "Ingen sessioner endnu",
    noExercises: "Ingen øvelser endnu",
    exercises: "Øvelser",
    back: "Tilbage",
    weight: "Vægt",
    reps: "Reps",
    equipment: "Udstyr",
    searchExercise: "Søg øvelse",
    add: "Tilføj",
    editSession: "Rediger session",
    createSession: "Opret session",
    createExercise: "Opret øvelse",
    chooseEquipment: "Vælg først udstyr",
    information: "Info",
    howTo: "Sådan gør du",
    tips: "Tips & tricks",
    remove: "Fjern",
    loginHint: "Dummy-login foreløbig",
    selectedLanguage: "Valgt sprog",
    sessionsCount: "sessioner",
    done: "Færdig",
  },
  no: {
    signIn: "Logg inn",
    email: "E-post",
    password: "Passord",
    continueEmail: "Fortsett med e-post",
    continueApple: "Fortsett med Apple",
    continueGoogle: "Fortsett med Google",
    continueX: "Fortsett med X",
    sessions: "Økter",
    addSession: "Legg til økt",
    addExercise: "Legg til øvelse",
    settings: "Innstillinger",
    profile: "Profil",
    appInfo: "Appinfo",
    privacy: "Personvernerklæring",
    language: "Språk",
    systemDefault: "Systemstandard",
    save: "Lagre",
    cancel: "Avbryt",
    selectGroups: "Velg hovedgrupper",
    noSessions: "Ingen økter ennå",
    noExercises: "Ingen øvelser ennå",
    exercises: "Øvelser",
    back: "Tilbake",
    weight: "Vekt",
    reps: "Reps",
    equipment: "Utstyr",
    searchExercise: "Søk øvelse",
    add: "Legg til",
    editSession: "Rediger økt",
    createSession: "Opprett økt",
    createExercise: "Opprett øvelse",
    chooseEquipment: "Velg utstyr først",
    information: "Info",
    howTo: "Slik gjør du",
    tips: "Tips & triks",
    remove: "Fjern",
    loginHint: "Dummy-innlogging foreløpig",
    selectedLanguage: "Valgt språk",
    sessionsCount: "økter",
    done: "Ferdig",
  },
  fi: {
    signIn: "Kirjaudu sisään",
    email: "Sähköposti",
    password: "Salasana",
    continueEmail: "Jatka sähköpostilla",
    continueApple: "Jatka Applella",
    continueGoogle: "Jatka Googlella",
    continueX: "Jatka X:llä",
    sessions: "Treenit",
    addSession: "Lisää treeni",
    addExercise: "Lisää liike",
    settings: "Asetukset",
    profile: "Profiili",
    appInfo: "Sovellustiedot",
    privacy: "Tietosuojaseloste",
    language: "Kieli",
    systemDefault: "Järjestelmän oletus",
    save: "Tallenna",
    cancel: "Peruuta",
    selectGroups: "Valitse pääryhmät",
    noSessions: "Ei vielä treenejä",
    noExercises: "Ei vielä liikkeitä",
    exercises: "Liikkeet",
    back: "Takaisin",
    weight: "Paino",
    reps: "Toistot",
    equipment: "Väline",
    searchExercise: "Etsi liikettä",
    add: "Lisää",
    editSession: "Muokkaa treeniä",
    createSession: "Luo treeni",
    createExercise: "Luo liike",
    chooseEquipment: "Valitse ensin väline",
    information: "Info",
    howTo: "Ohje",
    tips: "Vinkit",
    remove: "Poista",
    loginHint: "Valelkirjautuminen toistaiseksi",
    selectedLanguage: "Valittu kieli",
    sessionsCount: "treeniä",
    done: "Valmis",
  },
  el: {
    signIn: "Σύνδεση",
    email: "Email",
    password: "Κωδικός",
    continueEmail: "Συνέχεια με email",
    continueApple: "Συνέχεια με Apple",
    continueGoogle: "Συνέχεια με Google",
    continueX: "Συνέχεια με X",
    sessions: "Συνεδρίες",
    addSession: "Προσθήκη συνεδρίας",
    addExercise: "Προσθήκη άσκησης",
    settings: "Ρυθμίσεις",
    profile: "Προφίλ",
    appInfo: "Πληροφορίες εφαρμογής",
    privacy: "Δήλωση απορρήτου",
    language: "Γλώσσα",
    systemDefault: "Προεπιλογή συστήματος",
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    selectGroups: "Επιλέξτε κύριες ομάδες",
    noSessions: "Καμία συνεδρία ακόμη",
    noExercises: "Καμία άσκηση ακόμη",
    exercises: "Ασκήσεις",
    back: "Πίσω",
    weight: "Βάρος",
    reps: "Επαναλήψεις",
    equipment: "Εξοπλισμός",
    searchExercise: "Αναζήτηση άσκησης",
    add: "Προσθήκη",
    editSession: "Επεξεργασία συνεδρίας",
    createSession: "Δημιουργία συνεδρίας",
    createExercise: "Δημιουργία άσκησης",
    chooseEquipment: "Επιλέξτε πρώτα εξοπλισμό",
    information: "Πληροφορίες",
    howTo: "Τρόπος",
    tips: "Συμβουλές",
    remove: "Αφαίρεση",
    loginHint: "Δοκιμαστική σύνδεση προς το παρόν",
    selectedLanguage: "Επιλεγμένη γλώσσα",
    sessionsCount: "συνεδρίες",
    done: "Έτοιμο",
  },
  hu: {
    signIn: "Bejelentkezés",
    email: "E-mail",
    password: "Jelszó",
    continueEmail: "Folytatás e-maillel",
    continueApple: "Folytatás az Apple-lel",
    continueGoogle: "Folytatás a Google-lel",
    continueX: "Folytatás az X-szel",
    sessions: "Edzések",
    addSession: "Edzés hozzáadása",
    addExercise: "Gyakorlat hozzáadása",
    settings: "Beállítások",
    profile: "Profil",
    appInfo: "Alkalmazásinfó",
    privacy: "Adatvédelmi nyilatkozat",
    language: "Nyelv",
    systemDefault: "Rendszer alapértelmezett",
    save: "Mentés",
    cancel: "Mégse",
    selectGroups: "Válassz fő izomcsoportokat",
    noSessions: "Még nincs edzés",
    noExercises: "Még nincs gyakorlat",
    exercises: "Gyakorlatok",
    back: "Vissza",
    weight: "Súly",
    reps: "Ismétlés",
    equipment: "Eszköz",
    searchExercise: "Gyakorlat keresése",
    add: "Hozzáadás",
    editSession: "Edzés szerkesztése",
    createSession: "Edzés létrehozása",
    createExercise: "Gyakorlat létrehozása",
    chooseEquipment: "Először válassz eszközt",
    information: "Infó",
    howTo: "Hogyan",
    tips: "Tippek",
    remove: "Törlés",
    loginHint: "Egyelőre próba bejelentkezés",
    selectedLanguage: "Kiválasztott nyelv",
    sessionsCount: "edzés",
    done: "Kész",
  },
  uk: {
    signIn: "Увійти",
    email: "Електронна пошта",
    password: "Пароль",
    continueEmail: "Продовжити з e-mail",
    continueApple: "Продовжити з Apple",
    continueGoogle: "Продовжити з Google",
    continueX: "Продовжити з X",
    sessions: "Сесії",
    addSession: "Додати сесію",
    addExercise: "Додати вправу",
    settings: "Налаштування",
    profile: "Профіль",
    appInfo: "Інформація про застосунок",
    privacy: "Заява про конфіденційність",
    language: "Мова",
    systemDefault: "Системна за замовчуванням",
    save: "Зберегти",
    cancel: "Скасувати",
    selectGroups: "Оберіть основні групи",
    noSessions: "Ще немає сесій",
    noExercises: "Ще немає вправ",
    exercises: "Вправи",
    back: "Назад",
    weight: "Вага",
    reps: "Повторення",
    equipment: "Обладнання",
    searchExercise: "Пошук вправи",
    add: "Додати",
    editSession: "Редагувати сесію",
    createSession: "Створити сесію",
    createExercise: "Створити вправу",
    chooseEquipment: "Спочатку оберіть обладнання",
    information: "Інформація",
    howTo: "Як виконувати",
    tips: "Поради",
    remove: "Видалити",
    loginHint: "Поки що тестовий вхід",
    selectedLanguage: "Вибрана мова",
    sessionsCount: "сесій",
    done: "Готово",
  },
  ru: {
    signIn: "Войти",
    email: "Эл. почта",
    password: "Пароль",
    continueEmail: "Продолжить с e-mail",
    continueApple: "Продолжить с Apple",
    continueGoogle: "Продолжить с Google",
    continueX: "Продолжить с X",
    sessions: "Сессии",
    addSession: "Добавить сессию",
    addExercise: "Добавить упражнение",
    settings: "Настройки",
    profile: "Профиль",
    appInfo: "Информация о приложении",
    privacy: "Политика конфиденциальности",
    language: "Язык",
    systemDefault: "Системный по умолчанию",
    save: "Сохранить",
    cancel: "Отмена",
    selectGroups: "Выберите основные группы",
    noSessions: "Пока нет сессий",
    noExercises: "Пока нет упражнений",
    exercises: "Упражнения",
    back: "Назад",
    weight: "Вес",
    reps: "Повторения",
    equipment: "Оборудование",
    searchExercise: "Поиск упражнения",
    add: "Добавить",
    editSession: "Редактировать сессию",
    createSession: "Создать сессию",
    createExercise: "Создать упражнение",
    chooseEquipment: "Сначала выберите оборудование",
    information: "Инфо",
    howTo: "Как выполнять",
    tips: "Советы",
    remove: "Удалить",
    loginHint: "Пока тестовый вход",
    selectedLanguage: "Выбранный язык",
    sessionsCount: "сессий",
    done: "Готово",
  },
};

const fallbackKeys = STRINGS.en;
function tFor(lang, key) {
  return (STRINGS[lang] && STRINGS[lang][key]) || fallbackKeys[key] || key;
}

const EXERCISES = [
  {
    id: "1",
    name: "Incline Dumbbell Press",
    equipment: "Dumbbell",
    muscles: ["Chest", "Shoulders"],
    how: "Set the bench to a low incline. Lower with control, press up through the chest.",
    tips: "Keep wrists stacked. Drive elbows under the dumbbells.",
  },
  {
    id: "2",
    name: "Bench Press",
    equipment: "Barbell",
    muscles: ["Chest", "Shoulders", "Triceps"],
    how: "Unrack, lower to mid-chest, press back up in a strong line.",
    tips: "Pull shoulders back. Keep feet planted.",
  },
  {
    id: "3",
    name: "Cable Fly",
    equipment: "Cable",
    muscles: ["Chest"],
    how: "Set handles high or mid. Bring arms together in an arc.",
    tips: "Soft elbows. Squeeze chest, don’t swing.",
  },
  {
    id: "4",
    name: "Machine Chest Press",
    equipment: "Machine",
    muscles: ["Chest", "Shoulders", "Triceps"],
    how: "Set seat so handles align with chest. Press and control the return.",
    tips: "Avoid shrugging. Keep shoulder blades set.",
  },
  {
    id: "5",
    name: "Lat Pulldown",
    equipment: "Cable",
    muscles: ["Back", "Biceps"],
    how: "Pull bar to upper chest while driving elbows down.",
    tips: "Lean slightly, not excessively. Think elbows to ribs.",
  },
  {
    id: "6",
    name: "Seated Cable Row",
    equipment: "Cable",
    muscles: ["Back", "Biceps"],
    how: "Pull handle to torso with a tall chest and steady core.",
    tips: "Start by moving the elbows, not by yanking with hands.",
  },
  {
    id: "7",
    name: "Bent-Over Row",
    equipment: "Barbell",
    muscles: ["Back", "Biceps"],
    how: "Hinge at the hips, pull the bar toward lower ribs.",
    tips: "Keep torso fixed. Avoid jerking the weight.",
  },
  {
    id: "8",
    name: "Machine Shoulder Press",
    equipment: "Machine",
    muscles: ["Shoulders", "Triceps"],
    how: "Press up while keeping rib cage down and core braced.",
    tips: "Don’t force range if shoulders pinch.",
  },
  {
    id: "9",
    name: "Dumbbell Lateral Raise",
    equipment: "Dumbbell",
    muscles: ["Shoulders"],
    how: "Raise the dumbbells to the side to shoulder height.",
    tips: "Lead with elbows. Keep traps quiet.",
  },
  {
    id: "10",
    name: "Leg Press",
    equipment: "Machine",
    muscles: ["Legs"],
    how: "Lower under control and press through the mid-foot.",
    tips: "Don’t bounce at the bottom. Keep hips stable.",
  },
  {
    id: "11",
    name: "Barbell Squat",
    equipment: "Barbell",
    muscles: ["Legs"],
    how: "Brace, sit down and back, then drive up through the floor.",
    tips: "Keep knees tracking over toes.",
  },
  {
    id: "12",
    name: "Cable Curl",
    equipment: "Cable",
    muscles: ["Biceps"],
    how: "Curl with elbows pinned close to the body.",
    tips: "Keep tension on the cable the whole time.",
  },
  {
    id: "13",
    name: "Machine Triceps Press",
    equipment: "Machine",
    muscles: ["Triceps"],
    how: "Extend the handles and control the return.",
    tips: "Keep shoulders down and elbows stable.",
  },
];

const initialSessions = [
  {
    id: "s1",
    groups: ["Chest", "Shoulders"],
    exercises: [
      {
        id: "e1",
        exerciseId: "1",
        name: "Incline Dumbbell Press",
        equipment: "Dumbbell",
        weight: "26",
        reps: "8",
      },
      {
        id: "e2",
        exerciseId: "9",
        name: "Dumbbell Lateral Raise",
        equipment: "Dumbbell",
        weight: "12",
        reps: "12",
      },
    ],
  },
  {
    id: "s2",
    groups: ["Back", "Biceps"],
    exercises: [
      {
        id: "e3",
        exerciseId: "5",
        name: "Lat Pulldown",
        equipment: "Cable",
        weight: "55",
        reps: "10",
      },
      {
        id: "e4",
        exerciseId: "12",
        name: "Cable Curl",
        equipment: "Cable",
        weight: "25",
        reps: "12",
      },
    ],
  },

];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  const rows = left.length + 1;
  const cols = right.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[rows - 1][cols - 1];
}

function scoreExerciseMatch(query, exercise) {
  const q = normalizeText(query);
  const name = normalizeText(exercise.name);
  const equipment = normalizeText(exercise.equipment);
  const muscles = exercise.muscles.map(normalizeText).join(" ");
  const haystack = `${name} ${equipment} ${muscles}`.trim();

  if (!q) return 0;
  if (name === q) return 1000;
  if (name.startsWith(q)) return 850 - (name.length - q.length);
  if (name.includes(q)) return 760 - (name.length - q.length);
  if (haystack.includes(q)) return 650 - (haystack.length - q.length);

  const tokens = q.split(" ").filter(Boolean);
  let tokenScore = 0;
  tokens.forEach((token) => {
    if (name.includes(token)) tokenScore += 90;
    else if (haystack.includes(token)) tokenScore += 55;
  });

  const distance = levenshtein(q, name);
  const maxLen = Math.max(q.length, name.length, 1);
  const closeness = 1 - distance / maxLen;

  return Math.round(tokenScore + closeness * 420);
}

function getFuzzyExerciseMatches(query, exercises, limit = 8) {
  if (!query.trim()) return exercises.slice(0, limit);

  return exercises
    .map((exercise) => ({
      exercise,
      score: scoreExerciseMatch(query, exercise),
    }))
    .filter((entry) => entry.score > 120)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.exercise);
}

function normalizeSessionRow(row) {
  return {
    id: String(row.id),
    groups: Array.isArray(row.groups) ? row.groups : [],
    exercises: Array.isArray(row.exercises) ? row.exercises : [],
  };
}

async function fetchRemoteSessions(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, groups, exercises, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(normalizeSessionRow);
}

async function insertRemoteSession(userId, session) {
  const payload = {
    id: String(session.id),
    user_id: userId,
    groups: session.groups,
    exercises: session.exercises,
  };

  const { error } = await supabase.from("sessions").upsert(payload);
  if (error) throw error;
}

async function updateRemoteSession(userId, session) {
  const { error } = await supabase
    .from("sessions")
    .update({
      groups: session.groups,
      exercises: session.exercises,
    })
    .eq("id", String(session.id))
    .eq("user_id", userId);

  if (error) throw error;
}

async function deleteRemoteSession(userId, sessionId) {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", String(sessionId))
    .eq("user_id", userId);

  if (error) throw error;
}

function Background({ children }) {
  return (
    <ImageBackground
      source={BG}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />
      <View style={styles.contentWrap}>{children}</View>
    </ImageBackground>
  );
}

function Brand({ large = false }) {
  return (
    <View style={large ? styles.brandLargeWrap : styles.brandSmallWrap}>
      <Text style={large ? styles.brandLargeText : styles.brandSmallText}>
        <Text style={styles.brandX}>X</Text>-pand
      </Text>
      <Text style={large ? styles.brandLargeSub : styles.brandSmallSub}>
        Limits
      </Text>
    </View>
  );
}

function Header({ title, onBack, onSettings, t }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>‹ {t("back")}</Text>
        </Pressable>
      ) : (
        <View style={styles.headerBtnPlaceholder} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {onSettings ? (
        <Pressable onPress={onSettings} style={styles.headerGear}>
          <Text style={styles.gear}>⚙</Text>
        </Pressable>
      ) : (
        <View style={styles.headerBtnPlaceholder} />
      )}
    </View>
  );
}

function IntroGate({ onDone }) {
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const splashScale = useRef(new Animated.Value(0.9)).current;
  const loginOpacity = useRef(new Animated.Value(0)).current;
  const loginTranslateY = useRef(new Animated.Value(36)).current;
  const flashOne = useRef(new Animated.Value(0)).current;
  const flashTwo = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.96)).current;
  const boltShift = useRef(new Animated.Value(-18)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(splashScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 1150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(boltShift, {
          toValue: 0,
          duration: 820,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(flashOne, {
            toValue: 0.92,
            duration: 90,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(flashOne, {
            toValue: 0,
            duration: 220,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(150),
          Animated.timing(flashTwo, {
            toValue: 0.75,
            duration: 110,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(flashTwo, {
            toValue: 0,
            duration: 240,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.delay(950),
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(splashScale, {
          toValue: 1.14,
          duration: 520,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loginOpacity, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loginTranslateY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(() => onDone());
    return () => animation.stop();
  }, [boltShift, flashOne, flashTwo, loginOpacity, loginTranslateY, onDone, pulse, splashOpacity, splashScale]);

  return (
    <Background>
      <Animated.View pointerEvents="none" style={[styles.introFlash, { opacity: flashOne }]} />
      <Animated.View
        pointerEvents="none"
        style={[styles.introFlashSecondary, { opacity: flashTwo }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.introSplashLayer,
          {
            opacity: splashOpacity,
            transform: [{ scale: splashScale }, { translateY: boltShift }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Brand large />
          <Text style={styles.introTagline}>Charge. Lift. Repeat.</Text>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[
          styles.introLoginPreview,
          { opacity: loginOpacity, transform: [{ translateY: loginTranslateY }] },
        ]}
      >
        <Brand />
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.helper}>Sign in to sync your sessions</Text>
        </View>
      </Animated.View>
    </Background>
  );
}

function Login({ t, onLogin, busy, errorText }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Background>
      <Animated.View
        style={[styles.screen, { opacity, transform: [{ translateY }] }]}
      >
        <Brand />
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>{t("signIn")}</Text>
          <Text style={styles.helper}>{t("loginHint")}</Text>
          {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
          <TextInput
            placeholder={t("email")}
            placeholderTextColor="#9fb2c7"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder={t("password")}
            placeholderTextColor="#9fb2c7"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable
            style={[styles.primaryButton, busy && styles.buttonDisabled]}
            disabled={busy}
            onPress={() => onLogin(email.trim(), password)}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? "Connecting..." : t("continueEmail")}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Background>
  );
}

function SwipeRow({ children, onRemove, t }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const open = useRef(false);
  const DELETE_WIDTH = 112;

  const deleteOpacity = translateX.interpolate({
    inputRange: [-DELETE_WIDTH, -48, 0],
    outputRange: [1, 0.22, 0],
    extrapolate: "clamp",
  });

  const closeRow = () => {
    open.current = false;
    Animated.timing(translateX, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const openRow = () => {
    open.current = true;
    Animated.timing(translateX, {
      toValue: -DELETE_WIDTH,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          const base = open.current ? -DELETE_WIDTH : 0;
          const dx = Math.max(-DELETE_WIDTH, Math.min(0, base + g.dx * 0.9));
          translateX.setValue(dx);
        },
        onPanResponderRelease: (_, g) => {
          const projected = open.current ? -DELETE_WIDTH + g.dx : g.dx;
          if (projected < -52) openRow();
          else closeRow();
        },
        onPanResponderTerminate: closeRow,
      }),
    [translateX],
  );

  return (
    <View style={styles.swipeShell}>
      <Animated.View
        pointerEvents={open.current ? "auto" : "none"}
        style={[styles.deleteReveal, { opacity: deleteOpacity }]}
      >
        <Pressable style={styles.deleteIconWrap} onPress={onRemove}>
          <Text style={styles.deleteIcon}>−</Text>
          <Text style={styles.deleteText}>{t("remove")}</Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[styles.swipeContent, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

function SessionsScreen({ sessions, t, onAdd, onOpen, onDelete, onSettings }) {
  return (
    <Background>
      <View style={styles.screen}>
        <Header title={t("sessions")} onSettings={onSettings} t={t} />
        <ScrollView contentContainerStyle={styles.listContent}>
          <Brand />
          <Pressable style={styles.primaryButton} onPress={onAdd}>
            <Text style={styles.primaryButtonText}>{t("addSession")}</Text>
          </Pressable>
          {sessions.length === 0 && (
            <Text style={styles.emptyText}>{t("noSessions")}</Text>
          )}
          {sessions.map((s) => (
            <SwipeRow key={s.id} onRemove={() => onDelete(s.id)} t={t}>
              <Pressable
                style={styles.premiumCard}
                onPress={() => onOpen(s.id)}
              >
                <Text style={styles.cardTitle}>{s.groups.join(" + ")}</Text>
                <Text style={styles.cardSub}>
                  {s.exercises.length} {t("exercises")}
                </Text>
              </Pressable>
            </SwipeRow>
          ))}
        </ScrollView>
      </View>
    </Background>
  );
}

function SessionEditor({ t, onSave, onBack }) {
  const [selected, setSelected] = useState([]);
  const toggle = (g) =>
    setSelected((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  return (
    <Background>
      <View style={styles.screen}>
        <Header title={t("createSession")} onBack={onBack} t={t} />
        <View style={styles.panel}>
          <Text style={styles.cardTitle}>{t("selectGroups")}</Text>
          <View style={styles.chipsWrap}>
            {MUSCLE_GROUPS.map((g) => (
              <Pressable
                key={g}
                onPress={() => toggle(g)}
                style={[styles.chip, selected.includes(g) && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected.includes(g) && styles.chipTextActive,
                  ]}
                >
                  {g}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.primaryButton}
            onPress={() => selected.length && onSave(selected)}
          >
            <Text style={styles.primaryButtonText}>{t("save")}</Text>
          </Pressable>
        </View>
      </View>
    </Background>
  );
}

function SessionDetail({
  session,
  t,
  weightUnit,
  onBack,
  onAddExercise,
  onDeleteExercise,
  onUpdateExercise,
}) {
  return (
    <Background>
      <View style={styles.screen}>
        <Header title={session.groups.join(" + ")} onBack={onBack} t={t} />
        <ScrollView contentContainerStyle={styles.listContent}>
          <Pressable style={styles.primaryButton} onPress={onAddExercise}>
            <Text style={styles.primaryButtonText}>{t("addExercise")}</Text>
          </Pressable>
          {session.exercises.length === 0 && (
            <Text style={styles.emptyText}>{t("noExercises")}</Text>
          )}
          {session.exercises.map((ex) => (
            <SwipeRow
              key={ex.id}
              onRemove={() => onDeleteExercise(ex.id)}
              t={t}
            >
              <View style={styles.exerciseCard}>
                <View style={styles.exerciseTop}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseTag}>{ex.equipment}</Text>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{`${t("weight")} (${weightUnit})`}</Text>
                    <TextInput
                      style={styles.inlineInput}
                      value={String(ex.weight)}
                      keyboardType="numeric"
                      onChangeText={(v) =>
                        onUpdateExercise(ex.id, { weight: v })
                      }
                    />
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{t("reps")}</Text>
                    <TextInput
                      style={styles.inlineInput}
                      value={String(ex.reps)}
                      keyboardType="numeric"
                      onChangeText={(v) => onUpdateExercise(ex.id, { reps: v })}
                    />
                  </View>
                </View>
              </View>
            </SwipeRow>
          ))}
        </ScrollView>
      </View>
    </Background>
  );
}

function InfoModal({ visible, item, t, onClose }) {
  if (!item) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalShade}>
        <View style={styles.modalCard}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.modalLabel}>{t("howTo")}</Text>
          <Text style={styles.modalText}>{item.how}</Text>
          <Text style={styles.modalLabel}>{t("tips")}</Text>
          <Text style={styles.modalText}>{item.tips}</Text>
          <Pressable style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>{t("done")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ExerciseEditor({ session, t, onBack, onSave }) {
  const [equipment, setEquipment] = useState("");
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState(null);

  const scopedExercises = useMemo(
    () =>
      EXERCISES.filter(
        (x) =>
          (!equipment || x.equipment === equipment) &&
          x.muscles.some((m) => session.groups.includes(m)),
      ),
    [equipment, session.groups],
  );

  const filtered = useMemo(() => {
    const directMatches = scopedExercises.filter((x) =>
      x.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (directMatches.length) return directMatches;
    return getFuzzyExerciseMatches(query, scopedExercises);
  }, [query, scopedExercises]);

  const suggestion = query.trim() ? filtered[0] : null;
  const showSuggestion =
    !!suggestion &&
    normalizeText(suggestion.name) !== normalizeText(query) &&
    !suggestion.name.toLowerCase().includes(query.toLowerCase());

  return (
    <Background>
      <View style={styles.screen}>
        <Header title={t("createExercise")} onBack={onBack} t={t} />
        <ScrollView contentContainerStyle={styles.listContent}>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("equipment")}</Text>
            <View style={styles.chipsWrap}>
              {EQUIPMENT.map((eq) => (
                <Pressable
                  key={eq}
                  style={[styles.chip, equipment === eq && styles.chipActive]}
                  onPress={() => setEquipment(eq)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      equipment === eq && styles.chipTextActive,
                    ]}
                  >
                    {eq}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder={t("searchExercise")}
              placeholderTextColor="#9fb2c7"
              autoCapitalize="words"
              autoCorrect
            />
            {!equipment && (
              <Text style={styles.helper}>{t("chooseEquipment")}</Text>
            )}

            {showSuggestion && (
              <Pressable
                style={styles.smartSuggestion}
                onPress={() => {
                  setQuery(suggestion.name);
                  onSave(suggestion);
                }}
              >
                <Text style={styles.smartSuggestionLabel}>Smart match</Text>
                <Text style={styles.smartSuggestionName}>{suggestion.name}</Text>
                <Text style={styles.smartSuggestionMeta}>
                  Tap to use the exercise your user probably meant.
                </Text>
              </Pressable>
            )}

            {filtered.map((item) => (
              <View key={item.id} style={styles.lookupRow}>
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => {
                    setQuery(item.name);
                    onSave(item);
                  }}
                >
                  <Text style={styles.lookupName}>{item.name}</Text>
                  <Text style={styles.lookupMeta}>
                    {item.equipment} · {item.muscles.join(", ")}
                  </Text>
                </Pressable>
                <Pressable style={styles.infoBtn} onPress={() => setInfo(item)}>
                  <Text style={styles.infoBtnText}>i</Text>
                </Pressable>
              </View>
            ))}

            {!!equipment && !filtered.length && !!query.trim() && (
              <Text style={styles.helper}>
                No exact hit. Try another spelling or a different equipment filter.
              </Text>
            )}
          </View>
        </ScrollView>
        <InfoModal
          visible={!!info}
          item={info}
          t={t}
          onClose={() => setInfo(null)}
        />
      </View>
    </Background>
  );
}

function SettingsScreen({ lang, setLang, weightUnit, setWeightUnit, t, onBack, userEmail, onSignOut }) {
  const [open, setOpen] = useState(null);
  const selected = LANGUAGES.find((x) => x.code === lang)?.label || "System";
  return (
    <Background>
      <View style={styles.screen}>
        <Header title={t("settings")} onBack={onBack} t={t} />
        <ScrollView contentContainerStyle={styles.listContent}>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("profile")}</Text>
            <Text style={styles.modalText}>{userEmail || "Signed in"}</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("language")}</Text>
            <Pressable style={styles.dropdown} onPress={() => setOpen("language")}>
              <Text style={styles.dropdownText}>{selected}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </Pressable>
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("weightUnit")}</Text>
            <Pressable style={styles.dropdown} onPress={() => setOpen("weight") }>
              <Text style={styles.dropdownText}>{weightUnit}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </Pressable>
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("appInfo")}</Text>
            <Text style={styles.modalText}>{APP_NAME}</Text>
          </View>
          <View style={styles.panel}>
            <Text style={styles.cardTitle}>{t("privacy")}</Text>
            <Text style={styles.modalText}>
              Your sessions stay tied to your account and can sync across devices.
            </Text>
          </View>
          <Pressable style={styles.socialButton} onPress={onSignOut}>
            <Text style={styles.socialText}>{t("signOut")}</Text>
          </Pressable>
        </ScrollView>

        <Modal transparent visible={!!open} animationType="fade">
          <View style={styles.modalShade}>
            <View style={styles.dropdownModal}>
              {open === "language"
                ? LANGUAGES.map((item) => (
                    <Pressable
                      key={item.code}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setLang(item.code === "system" ? "en" : item.code);
                        setOpen(null);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{item.label}</Text>
                    </Pressable>
                  ))
                : [t("kilograms"), t("pounds")].map((label, index) => (
                    <Pressable
                      key={label}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setWeightUnit(index === 0 ? "Kg" : "Lbs");
                        setOpen(null);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{label}</Text>
                    </Pressable>
                  ))}
            </View>
          </View>
        </Modal>
      </View>
    </Background>
  );
}

export default function App() {
  const [route, setRoute] = useState("login");
  const [lang, setLang] = useState("en");
  const [weightUnit, setWeightUnit] = useState("Kg");
  const [splashDone, setSplashDone] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [authSession, setAuthSession] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loadingRemote, setLoadingRemote] = useState(true);

  const t = (key) => tFor(lang, key);
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const userId = authSession?.user?.id;
  const userEmail = authSession?.user?.email || "";

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthSession(data.session ?? null);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session ?? null);
      if (splashDone) setRoute(session ? "sessions" : "login");
      if (!session) {
        setSessions([]);
        setActiveSessionId(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [splashDone]);

  useEffect(() => {
    if (splashDone) setRoute(authSession ? "sessions" : "login");
  }, [splashDone, authSession]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!userId) {
        setLoadingRemote(false);
        return;
      }

      setLoadingRemote(true);
      try {
        const remoteSessions = await fetchRemoteSessions(userId);
        if (!alive) return;
        if (remoteSessions.length) setSessions(remoteSessions);
        else setSessions(initialSessions);
      } catch (error) {
        console.log("Failed to load sessions:", error.message);
        if (alive) setSessions(initialSessions);
      } finally {
        if (alive) setLoadingRemote(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [userId]);

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      setAuthError("Enter your email and password.");
      return;
    }

    setAuthBusy(true);
    setAuthError("");

    const signInResult = await supabase.auth.signInWithPassword({ email, password });

    if (!signInResult.error) {
      setAuthBusy(false);
      return;
    }

    const signUpResult = await supabase.auth.signUp({ email, password });

    if (signUpResult.error) {
      setAuthError(signUpResult.error.message);
    } else {
      setAuthError("Account created. Check your email if confirmation is enabled, then sign in.");
    }

    setAuthBusy(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setRoute("login");
  };

  const addSession = async (groups) => {
    const newSession = { id: String(Date.now()), groups, exercises: [] };
    setSessions((prev) => [...prev, newSession]);
    setRoute("sessions");

    if (userId) {
      try {
        await insertRemoteSession(userId, newSession);
      } catch (error) {
        console.log("Failed to save session:", error.message);
      }
    }
  };

  const deleteSession = async (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) setRoute("sessions");

    if (userId) {
      try {
        await deleteRemoteSession(userId, id);
      } catch (error) {
        console.log("Failed to delete session:", error.message);
      }
    }
  };

  const addExercise = async (item) => {
    let updatedSession = null;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        updatedSession = {
          ...s,
          exercises: [
            ...s.exercises,
            {
              id: String(Date.now()),
              exerciseId: item.id,
              name: item.name,
              equipment: item.equipment,
              weight: "",
              reps: "",
            },
          ],
        };
        return updatedSession;
      }),
    );

    setRoute("detail");

    if (userId && updatedSession) {
      try {
        await updateRemoteSession(userId, updatedSession);
      } catch (error) {
        console.log("Failed to save exercise:", error.message);
      }
    }
  };

  const deleteExercise = async (id) => {
    let updatedSession = null;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        updatedSession = { ...s, exercises: s.exercises.filter((e) => e.id !== id) };
        return updatedSession;
      }),
    );

    if (userId && updatedSession) {
      try {
        await updateRemoteSession(userId, updatedSession);
      } catch (error) {
        console.log("Failed to delete exercise:", error.message);
      }
    }
  };

  const updateExercise = async (id, patch) => {
    let updatedSession = null;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        updatedSession = {
          ...s,
          exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        };
        return updatedSession;
      }),
    );

    if (userId && updatedSession) {
      try {
        await updateRemoteSession(userId, updatedSession);
      } catch (error) {
        console.log("Failed to update exercise:", error.message);
      }
    }
  };

  if (!splashDone) return <IntroGate onDone={() => setSplashDone(true)} />;
  if (route === "login")
    return <Login t={t} onLogin={handleLogin} busy={authBusy} errorText={authError} />;
  if (route === "create-session")
    return (
      <SessionEditor
        t={t}
        onSave={addSession}
        onBack={() => setRoute("sessions")}
      />
    );
  if (route === "settings")
    return (
      <SettingsScreen
        lang={lang}
        setLang={setLang}
        t={t}
        onBack={() => setRoute("sessions")}
        userEmail={userEmail}
        weightUnit={weightUnit}
        setWeightUnit={setWeightUnit}
        onSignOut={handleSignOut}
      />
    );
  if (route === "detail" && activeSession)
    return (
      <SessionDetail
        session={activeSession}
        t={t}
        weightUnit={weightUnit}
        onBack={() => setRoute("sessions")}
        onAddExercise={() => setRoute("create-exercise")}
        onDeleteExercise={deleteExercise}
        onUpdateExercise={updateExercise}
      />
    );
  if (route === "create-exercise" && activeSession)
    return (
      <ExerciseEditor
        session={activeSession}
        t={t}
        onBack={() => setRoute("detail")}
        onSave={addExercise}
      />
    );

  return loadingRemote ? (
    <Background>
      <View style={styles.screen}>
        <Header title={t("sessions")} onSettings={() => setRoute("settings")} t={t} />
        <View style={styles.panel}>
          <Text style={styles.modalText}>Syncing your sessions...</Text>
        </View>
      </View>
    </Background>
  ) : (
    <SessionsScreen
      sessions={sessions}
      t={t}
      onAdd={() => setRoute("create-session")}
      onOpen={(id) => {
        setActiveSessionId(id);
        setRoute("detail");
      }}
      onDelete={deleteSession}
      onSettings={() => setRoute("settings")}
    />
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#050915" },
  bgImage: { width: "100%", height: "100%", top: 0, bottom: 0 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,16,0.40)",
  },
  contentWrap: { flex: 1 },
  splashCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  introSplashLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  introLoginPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  introFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(175,220,255,0.18)",
  },
  introFlashSecondary: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  introTagline: {
    marginTop: 14,
    color: "#d7e7ff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3.2,
    textTransform: "uppercase",
    textAlign: "center",
    textShadowColor: "rgba(120,180,255,0.35)",
    textShadowRadius: 10,
  },
  brandLargeWrap: { alignItems: "center" },
  brandLargeText: {
    fontSize: 52,
    fontWeight: "900",
    color: "#f4f8ff",
    textShadowColor: "rgba(140,200,255,0.35)",
    textShadowRadius: 20,
    letterSpacing: 0.4,
  },
  brandX: {
    color: "#e33232",
    textShadowColor: "rgba(255,50,50,0.72)",
    textShadowRadius: 18,
  },
  brandLargeSub: {
    alignSelf: "flex-start",
    marginLeft: 6,
    marginTop: 2,
    fontSize: 26,
    fontWeight: "800",
    color: "#d9e9ff",
    letterSpacing: 2.2,
  },
  brandSmallWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 8,
  },
  brandSmallText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#f4f8ff",
    textShadowColor: "rgba(140,200,255,0.3)",
    textShadowRadius: 12,
  },
  brandSmallSub: {
    marginTop: -2,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#dce8ff",
    textAlign: "center",
  },

  screen: { flex: 1, paddingTop: 58, paddingHorizontal: 18, paddingBottom: 18 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: { color: "#f4f8ff", fontSize: 22, fontWeight: "800" },
  headerBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  headerBtnText: { color: "#dce6fb", fontSize: 16, fontWeight: "700" },
  headerBtnPlaceholder: { width: 64 },
  headerGear: { padding: 8 },
  gear: { color: "#e8f1ff", fontSize: 22 },
  listContent: { paddingBottom: 28, gap: 12 },

  panel: {
    backgroundColor: "rgba(10,16,30,0.72)",
    borderWidth: 1,
    borderColor: "rgba(160,195,255,0.18)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  loginCard: {
    backgroundColor: "rgba(10,16,30,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  premiumCard: {
    width: "100%",
    backgroundColor: "rgba(12,18,34,0.82)",
    borderWidth: 1,
    borderColor: "rgba(168,200,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 10,
  },
  cardTitle: { color: "#f8fbff", fontSize: 20, fontWeight: "800" },
  cardSub: { color: "#b3c5dc", fontSize: 14, marginTop: 6 },
  helper: { color: "#a8b9ce", fontSize: 14, marginTop: 6, marginBottom: 10 },
  errorText: { color: "#ff9d9d", fontSize: 14, marginBottom: 10 },
  buttonDisabled: { opacity: 0.65 },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#d22b2b",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  socialButton: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  socialText: { color: "#eef5ff", fontWeight: "700", fontSize: 16 },
  emptyText: {
    color: "#d7e5f7",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  chip: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipActive: {
    backgroundColor: "rgba(210,43,43,0.28)",
    borderColor: "rgba(255,90,90,0.32)",
  },
  chipText: { color: "#dbe7fa", fontWeight: "700" },
  chipTextActive: { color: "#fff" },

  swipeShell: {
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
  },
  deleteReveal: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 118,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  deleteIconWrap: {
    height: "100%",
    width: 112,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "rgba(210,43,43,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 34,
  },
  deleteText: { color: "#fff", fontSize: 13, fontWeight: "700", marginTop: 4 },
  swipeContent: { width: "100%" },

  exerciseCard: {
    backgroundColor: "rgba(12,18,34,0.84)",
    borderWidth: 1,
    borderColor: "rgba(168,200,255,0.16)",
    borderRadius: 24,
    padding: 16,
  },
  exerciseTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  exerciseName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    flex: 1,
    paddingRight: 10,
  },
  exerciseTag: {
    color: "#c7d8f3",
    fontWeight: "700",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 12,
  },
  statLabel: {
    color: "#9eb4cf",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inlineInput: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    paddingVertical: 4,
  },

  lookupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  lookupName: { color: "#fff", fontWeight: "800", fontSize: 16 },
  lookupMeta: { color: "#9eb4cf", fontSize: 13, marginTop: 4 },
  smartSuggestion: {
    marginBottom: 14,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(210,43,43,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.28)",
  },
  smartSuggestionLabel: {
    color: "#ffd8d8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  smartSuggestionName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  smartSuggestionMeta: {
    color: "#f0c7c7",
    fontSize: 13,
    marginTop: 4,
  },
  infoBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  infoBtnText: { color: "#fff", fontWeight: "800" },

  modalShade: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#101a2e",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalLabel: {
    color: "#dfeafe",
    fontWeight: "800",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 6,
  },
  modalText: { color: "#bcd0e8", fontSize: 15, lineHeight: 22 },

  dropdown: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { color: "#eef5ff", fontWeight: "700", fontSize: 15 },
  dropdownArrow: { color: "#eef5ff", fontSize: 16 },
  dropdownModal: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: "#101a2e",
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  dropdownOption: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  dropdownOptionText: { color: "#eef5ff", fontSize: 16, fontWeight: "600" },
});
