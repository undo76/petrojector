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

type PageProps = { header: Markup; content: Markup; footer: Markup };

function Page({ header, content, footer }: PageProps): Markup {
  return `
    <div>
        ${header} 
        ${content} 
        ${footer}
    </div>
`;
}

const myPage = Page({
  header: Header({ welcomeMessage: "Welcome!" }),
  content: Content({ content: "Lorem ipsum dolor..." }),
  footer: Footer({ year: 2021 }),
});

console.log(myPage);

// We would like to create a template with the header and footer injected as
// to inject the content later.

// This fails as content is missing
// const Skeleton = Page({
//     header: Header({ welcomeMessage: "Welcome!" }),
//     footer: Footer({ year: 2021 }),
// });

// This function inject properties to the component, returning a new type-safe
// partially applied component. It can be applied several times.
// Typing works, but there's room for improvement.
function inject<T extends P, P, R>(component: (props: T) => R, props: P) {
  return function (props2: Omit<T, keyof P> | T = {} as T): R {
    let allProps = { ...props, ...props2 };
    return component(allProps as T); // TODO: This cast seems unnecessary
  };
}

// Create a Page template with the header and footer already applied.
const PageTemplate = inject(Page, {
  header: Header({ welcomeMessage: "Welcome!" }),
  footer: Footer({ year: 2021 }),
});

// This doesn't work, as it needs "content" to be filled in too.
// const out = PageTemplate({});
// console.log(out);

// Add content
const page2 = PageTemplate({ content: "adios" });
console.log(page2);

// Override header
const page3 = PageTemplate({ header: "Header overriden!", content: "wiiiiii" });
console.log(page3);

// Apply partial again, creating a new Partial with all the properties
const FullPageTemplate = inject(PageTemplate, {
  content: "That's all folks",
  footer: Footer({ year: 1976 }),
});
const out4 = FullPageTemplate();
console.log(out4);
