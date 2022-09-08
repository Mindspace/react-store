import React from 'react';

import './code-box.scss';

function toStyle(src = '') {
  const styles = src.replace(/\s/g, '').split(';');

  return styles.reduce((result, it) => {
    const [name, value] = it.split(':');
    return !!name && value ? { ...result, [name]: value } : result;
  }, {});
}

export interface CodeBoxProps {
  src: string;
  fileName: string;
  style?: string;
}

export const CodeBox: React.FC<CodeBoxProps> = ({ src, fileName, style }) => {
  const fullStyles: React.CSSProperties = {
    ...toStyle('width: 611px; height: 400px; border:0; transform: scale(1); overflow:hidden;'),
    ...toStyle(style),
  };

  return (
    <div className="flex max-w items-center">
      <div className="codeBox" style={{ width: fullStyles.width }}>
        <div className="file">
          <svg className="icon" width="18" height="18" viewBox="0 0 25 25">
            <path d="M0.9985 0.9985C1.63783 0.359171 2.50494 0 3.40909 0H11.3636C11.665 0 11.9541 0.119724 12.1672 0.332833L20.1217 8.28738C20.3348 8.50049 20.4545 8.78953 20.4545 9.09091V21.5909C20.4545 22.4951 20.0954 23.3622 19.456 24.0015C18.8167 24.6408 17.9496 25 17.0455 25H3.40909C2.50494 25 1.63783 24.6408 0.9985 24.0015C0.359171 23.3622 0 22.4951 0 21.5909V3.40909C0 2.50494 0.359171 1.63783 0.9985 0.9985ZM3.40909 2.27273C3.10771 2.27273 2.81867 2.39245 2.60556 2.60556C2.39245 2.81867 2.27273 3.10771 2.27273 3.40909V21.5909C2.27273 21.8923 2.39245 22.1813 2.60556 22.3944C2.81867 22.6075 3.10771 22.7273 3.40909 22.7273H17.0455C17.3468 22.7273 17.6359 22.6075 17.849 22.3944C18.0621 22.1813 18.1818 21.8923 18.1818 21.5909V9.56161L10.8929 2.27273H3.40909Z"></path>
            <path d="M11.3636 0C11.9912 0 12.5 0.508767 12.5 1.13636V7.95455H19.3182C19.9458 7.95455 20.4545 8.46331 20.4545 9.09091C20.4545 9.71851 19.9458 10.2273 19.3182 10.2273H11.3636C10.736 10.2273 10.2273 9.71851 10.2273 9.09091V1.13636C10.2273 0.508767 10.736 0 11.3636 0Z"></path>
          </svg>
          {fileName}
        </div>
        <iframe src={src} style={fullStyles} sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>
  );
};
