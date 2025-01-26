"use client"
import { useState } from "react";
import ObjectPropertiesEditor from "./ObjectPropertiesEditor";

export default function App() {
  const [schema, setSchema] = useState({
    name: "",
    description: "",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  });

  const [previewJSON, setPreviewJSON] = useState(JSON.stringify(schema, null, 2));
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedSchema = { ...schema, [name]: value };
    setSchema(updatedSchema);
    setPreviewJSON(JSON.stringify(updatedSchema, null, 2));
  };

  const handleParametersChange = (updatedParameters) => {
    const updatedSchema = {
      ...schema,
      parameters: {
        ...schema.parameters,
        ...updatedParameters,
      },
    };
    setSchema(updatedSchema);
    setPreviewJSON(JSON.stringify(updatedSchema, null, 2));
  };

  const handlePreviewChange = (e) => {
    const updatedJSON = e.target.value;
    setPreviewJSON(updatedJSON);

    try {
      const parsedJSON = JSON.parse(updatedJSON);
      setSchema(parsedJSON);
      setError("");
    } catch (err) {
      setError("Invalid JSON schema. Please correct any syntax errors.");
    }
  };

  const validateSchema = () => {
    try {
      const parsedSchema = JSON.parse(previewJSON);
      if (!parsedSchema.name || !parsedSchema.description || !parsedSchema.parameters) {
        throw new Error("Schema must include name, description, and parameters.");
      }
      if (parsedSchema.parameters.type !== "object") {
        throw new Error("Parameters must be of type 'object'.");
      }
      setError("");
      alert("Schema is valid!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6 flex flex-col">
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">OpenAI Function Schema Builder</h1>
        <a href="https://platform.openai.com/docs/guides/function-calling" target="_blank" className="ml-auto underline">
          OpenAI Function Schema Docs
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto grow">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Builder</h2>
          <div className="mb-4">
            <label className="block font-medium">Function Name</label>
            <input
              type="text"
              name="name"
              value={schema.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Enter function name"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={schema.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              placeholder="Enter function description"
            />
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Parameters</h3>
            <ObjectPropertiesEditor
              properties={schema.parameters.properties}
              required={schema.parameters.required}
              onChange={handleParametersChange}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col">
          <div className='flex mb-4'>
            <h2 className="text-xl font-semibold">Preview & Validation</h2>
            <button
              onClick={validateSchema}
              className="px-4 py-2 bg-green-500 text-white rounded ml-auto"
            >
              Validate Schema
            </button>
          </div>
          <textarea
            value={previewJSON}
            onChange={handlePreviewChange}
            className="w-full h-64 border p-2 rounded font-mono text-sm grow"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <div className="mt-4 text-center">
        Made by <a href="http://x.com/matt_r_steele" target="_blank" className="underline">mrsteele</a>
      </div>
    </div>
  );
}
