"use client"
import React, { useState } from "react";
import './globals.css'

export const metadata = {
  title: 'OpenAI Function Schema Generator | Build Accurate AI Function Schemas',
  description:
    'Generate precise and efficient schemas for OpenAI functions effortlessly. Our tool helps developers design AI function schemas for better integrations and accuracy.',
  keywords: [
    'OpenAI function schema generator',
    'AI schema tool',
    'OpenAI integration',
    'function schema builder',
    'AI function design',
  ],
  authors: [{ name: 'Your Name or Company' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    title: 'OpenAI Function Schema Generator | Build Accurate AI Function Schemas',
    description:
      'Quickly create and optimize schemas for OpenAI functions with our powerful tool. Perfect for developers and AI enthusiasts.',
    url: 'https://www.yourwebsite.com/openai-function-schema-generator',
    type: 'website',
    images: [
      {
        url: 'https://www.yourwebsite.com/images/og-schema-generator.png',
        width: 1200,
        height: 630,
        alt: 'OpenAI Function Schema Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAI Function Schema Generator',
    description:
      'Generate schemas for OpenAI functions easily with our intuitive tool. Optimize AI integrations now.',
    images: ['https://www.yourwebsite.com/images/twitter-schema-generator.png'],
  },
  alternates: {
    canonical: 'https://www.yourwebsite.com/openai-function-schema-generator',
  },
};

function ObjectPropertiesEditor({ properties, required, onChange }) {
  const [editingKeys, setEditingKeys] = useState({});

  const handleNameChange = (oldKey, newKey) => {
    setEditingKeys({ ...editingKeys, [oldKey]: newKey });
  };

  const handleNameBlur = (oldKey) => {
    const newKey = editingKeys[oldKey];
    if (newKey && newKey !== oldKey) {
      const updatedProperties = { ...properties };
      if (!updatedProperties[newKey]) {
        updatedProperties[newKey] = updatedProperties[oldKey];
        delete updatedProperties[oldKey];
        const updatedRequired = required.map((item) => (item === oldKey ? newKey : item));
        onChange({ properties: updatedProperties, required: updatedRequired });
      }
    }
    setEditingKeys((prev) => {
      const updated = { ...prev };
      delete updated[oldKey];
      return updated;
    });
  };

  const handlePropertyChange = (key, field, value) => {
    const updatedProperties = { ...properties };
    if (field === "type" && value !== "object" && value !== "array") {
      delete updatedProperties[key].properties;
      delete updatedProperties[key].items;
    } else if (field === "type" && value === "object") {
      updatedProperties[key].properties = updatedProperties[key].properties || {};
      updatedProperties[key].required = updatedProperties[key].required || [];
    } else if (field === "type" && value === "array") {
      updatedProperties[key].items = updatedProperties[key].items || { type: "string" };
    }
    updatedProperties[key] = {
      ...updatedProperties[key],
      [field]: value,
    };
    onChange({ properties: updatedProperties, required });
  };

  const handleRequiredChange = (key, parentRequired) => {
    const updatedRequired = parentRequired.includes(key)
      ? parentRequired.filter((item) => item !== key)
      : [...parentRequired, key];
    onChange({ properties, required: updatedRequired });
  };

  const addProperty = () => {
    const newKey = `property_${Object.keys(properties).length + 1}`;
    const updatedProperties = {
      ...properties,
      [newKey]: { type: "string", description: "" },
    };
    onChange({ properties: updatedProperties, required });
  };

  const removeProperty = (key) => {
    const updatedProperties = { ...properties };
    delete updatedProperties[key];
    const updatedRequired = required.filter((item) => item !== key);
    onChange({ properties: updatedProperties, required: updatedRequired });
  };

  return (
    <div>
      {Object.keys(properties).map((key) => (
        <div key={key} className="border p-2 rounded mb-2">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={editingKeys[key] !== undefined ? editingKeys[key] : key}
              onChange={(e) => handleNameChange(key, e.target.value)}
              onBlur={() => handleNameBlur(key)}
              className="flex-grow border p-2 rounded mr-2"
              placeholder="Property name"
            />
            <button
              onClick={() => removeProperty(key)}
              className="ml-2 text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Type</label>
            <select
              value={properties[key].type}
              onChange={(e) => handlePropertyChange(key, "type", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={properties[key].description || ""}
              onChange={(e) => handlePropertyChange(key, "description", e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter description"
            />
          </div>
          {properties[key].type === "object" && (
            <div className="pl-4 border-l-2">
              <h4 className="font-medium">Object Properties</h4>
              <ObjectPropertiesEditor
                properties={properties[key].properties || {}}
                required={properties[key].required || []}
                onChange={(updated) =>
                  handlePropertyChange(key, "properties", updated.properties)
                }
              />
              <div className="mt-2">
                <h5 className="font-medium">Required Fields</h5>
                {Object.keys(properties[key].properties || {}).map((subKey) => (
                  <div key={subKey} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={properties[key].required?.includes(subKey) || false}
                      onChange={() =>
                        handleRequiredChange(
                          subKey,
                          properties[key].required || []
                        )
                      }
                      className="mr-2"
                    />
                    <label>{subKey}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {properties[key].type === "array" && (
            <div className="pl-4 border-l-2">
              <h4 className="font-medium">Array Items</h4>
              <label className="block text-sm font-medium">Type</label>
              <select
                value={properties[key].items?.type || ""}
                onChange={(e) =>
                  handlePropertyChange(key, "items", { type: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
              {properties[key].items?.type === "object" && (
                <div className="pl-4 border-l-2">
                  <h4 className="font-medium">Object Properties</h4>
                  <ObjectPropertiesEditor
                    properties={properties[key].items?.properties || {}}
                    required={properties[key].items?.required || []}
                    onChange={(updated) =>
                      handlePropertyChange(key, "items", {
                        ...properties[key].items,
                        properties: updated.properties,
                      })
                    }
                  />
                  <div className="mt-2">
                    <h5 className="font-medium">Required Fields</h5>
                    {Object.keys(properties[key].items?.properties || {}).map((subKey) => (
                      <div key={subKey} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            properties[key].items?.required?.includes(subKey) || false
                          }
                          onChange={() =>
                            handleRequiredChange(
                              subKey,
                              properties[key].items?.required || []
                            )
                          }
                          className="mr-2"
                        />
                        <label>{subKey}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={required.includes(key)}
              onChange={() => handleRequiredChange(key, required)}
              className="mr-2"
            />
            <label className="text-sm font-medium">Required</label>
          </div>
        </div>
      ))}
      <button
        onClick={addProperty}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Property
      </button>
    </div>
  );
}

export default function OpenAISchemaBuilder() {
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
