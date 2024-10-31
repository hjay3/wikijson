import React from 'react';
import { JsonEditor } from 'json-edit-react';

interface JsonViewerProps {
  data: any;
}

const customTheme = {
  styles: {
    container: {
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    },
    property: '#333333',
    string: 'rgb(0, 128, 0)',
    number: 'rgb(0, 0, 255)',
    boolean: 'rgb(128, 0, 128)',
    null: { color: 'rgb(128, 128, 128)', fontStyle: 'italic' },
  },
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">JSON Data</h2>
      <JsonEditor
        data={data}
        theme={customTheme}
        readOnly={true}
      />
    </div>
  );
};

export default JsonViewer;