import ReactDOM from 'react-dom/client';

export const extractSVGFromReactComponent = (Component: React.FC) => {
    const div = document.createElement('div');

    const root = ReactDOM.createRoot(div);

    root.render(<Component />);

    const svg = div.querySelector('svg');

    if (!svg) {
        throw new Error('Could_not_extract_SVG_from_component');
    }

    const html = svg.innerHTML;

    root.unmount();

    return html;
};
