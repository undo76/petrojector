type Language = "en" | "fr" | "es";
type Html = string;

type Translations = { [lang in Language]: { [key: string]: Html } };
const translations: Translations = {
  en: {
    welcome: "Welcome!",
  },
  fr: {
    welcome: "Bienvenue!",
  },
  es: {
    welcome: "¡Bienvenido!",
  },
};

/* Components */

// Simulate a service for current language using a closure
// instead of a global to preserve encapsulation
function languageService(
  defaultLanguage: Language,
  translations: Translations
): [(key: string) => string, () => Language, (lang: Language) => void] {
  let currentLanguage: Language = defaultLanguage;
  const translate = (key: string) => `${translations[currentLanguage][key]}`;
  const getter = () => currentLanguage;
  const setter = (lang: Language) => {
    currentLanguage = lang;
  };
  return [translate, getter, setter];
}

const [translate, getCurrentLanguage, setCurrentLanguage] = languageService(
  "en",
  translations
);

function message(key: string, lang: Language): Html {
  // Here the should be a call to translate function
  return `translate('${key}', '${lang}}')`;
}

function topBar(welcomeMessageFn: (key: string) => Html): Html {
  const welcomeMessage: Html = welcomeMessageFn("welcome");
  return `<h1>${welcomeMessage}</h1>`;
}

function app(topBarFn: () => Html, mainContent: () => Html): Html {
  return `<header>${topBarFn()}</header><main>${mainContent()}</main>`;
}

/* Injection */
const myMessageFunc: (key: string) => Html = (key: string) =>
  message(key, getCurrentLanguage());
const myTopBar: () => Html = () => topBar(myMessageFunc);
const myContent: () => Html = () => `<article>Lorem ipsum...</article>`;
const myApp: () => Html = () => app(myTopBar, myContent);

/* Main */
const htmlEn = myApp();
console.log(htmlEn);

setCurrentLanguage("fr");
const htmlFr = myApp();
console.log(htmlFr);

/*
[16:18, 19/2/2021] Pedro Abelleira: fn message(key: string, lang: LanguageEnum)
[16:18, 19/2/2021] Pedro Abelleira: y este componente lo voy a usar en la aplicación en muchos sitios
: pero no tal cual
: no voy a inyectar la funcion message
: voy a inyectar aplicaciones parciales de esa función
: en mi aplicación tengo una función, definida de alguna manera, que devuelve el idioma actual
: current_language()
: así que mi componente message en mi applicación se define como
: const my_message = message(_, current_language())
: y mi componente welcome_message, que se usa en la página de inicio en la top bar y en el título del contenido principal, se define como
: const welcome_message = my_message("welcome")
: ese componente welcome_message es el que inyecto en la top bar y en el contenido principal
: con lo cual ellos no tienen que saber nada sobre internacionalización ni sobre qué keys se van a mostrar
: el componente top_bar sería algo como
: function top_bar(welcome_message: Function, ...)
el componente contenido principal sería
: function main_content(welcome_message: Function, ...)
ra estos dos también se haría aplicación parcial para inyectarles el welcome_message que ya tengo, así que "pierden" ese parámetro
: al final inyectas todo y pierden todos los parámetros
: con lo cual la app es
: function app(top_bar: function, main_content: function)
my_app
: const my_app(my_top_bar, my_main_content) y ya es una función de cero parámetros
: arranco la app con
: app()
: voilà
 */
