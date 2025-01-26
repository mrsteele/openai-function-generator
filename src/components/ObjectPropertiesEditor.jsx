"use client"
import { useState } from "react";

export default function ObjectPropertiesEditor({ properties, required, onChange }) {
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