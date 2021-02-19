type Markup = string;

type HeaderProps = { welcomeMessage: Markup };

function Header({ welcomeMessage }: HeaderProps): Markup {
  return `<header>${welcomeMessage}</header>`;
}

type FooterProps = { year: number };

function Footer({ year }: FooterProps): Markup {
  return `<footer>Copyright - ${year}</footer>`;
}

type ContentProps = { content: Markup };

function Content({ content }: ContentProps): Markup {
  return `<main>${content}</main>`;
}

type AppProps = { header: Markup; content: Markup; footer: Markup };

function App({ header, content, footer }: AppProps): Markup {
  return `
    <div>
        ${header} 
        ${content} 
        ${footer}
    </div>
`;
}

const myApp2 = App({
  header: Header({ welcomeMessage: "Welcome!" }),
  content: Content({ content: "Lorem ipsum dolor..." }),
  footer: Footer({ year: 2021 }),
});

console.log(myApp2);

// We would like to create a template with the header and footer injected, and the content missing.
// The idea is to inject the content later.

// This fails as content is missing
// const Skeleton = App({
//     header: Header({ welcomeMessage: "Welcome!" }),
//     footer: Footer({ year: 2021 }),
// });

// This function creates a partial component with the passed props applied.
// It can be applied several times. Typing works, but I think it could be improved.
function partial<T extends P, P, R>(component: (props: T) => R, props: P) {
  return function (props2: Omit<T, keyof P> | T = {} as T): R {
    let allProps = { ...props, ...props2 };
    return component(allProps as T); // TODO: This cast seems unnecessary
  };
}

const AppTemplate = partial(App, {
  header: Header({ welcomeMessage: "Welcome!" }),
  footer: Footer({ year: 2021 }),
});

// Doesn't work, needs "content"
// const out = AppTemplate({});
// console.log(out);

// Add content
const out2 = AppTemplate({ content: "adios" });
console.log(out2);

// Override header
const out3 = AppTemplate({ header: "Header overriden!", content: "wiiiiii" });
console.log(out3);

// Apply partial to the template to add content and footer.
const FullApp = partial(AppTemplate, {
  content: "That's all folks",
  footer: Footer({ year: 1976 }),
});
const out4 = FullApp();
console.log(out4);
