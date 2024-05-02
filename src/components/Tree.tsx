import React, { useState } from "react";


export default function Tree({ yamlData = {}, propertyKey, handleUpdateValue }: any) {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});


    const toggleItemExpansion = (itemKey: string) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [itemKey]: !prevState[itemKey]
        }));
    };


    const renderNode = (nodeValue: any, nodeKey: string) => {
        const isArray = Array.isArray(nodeValue);
        const isExpandable = typeof nodeValue === 'object' && nodeValue !== null;
        const isExpanded = expandedItems[nodeKey];


        if (isArray) {
            return (
                <div key={nodeKey} style={{ marginBottom: "10px" }}>
                    <span onClick={() => toggleItemExpansion(nodeKey)}>{nodeKey.split('.').slice(-1)[0]} :</span>
                    {isExpanded && nodeValue.map((itemValue: any, index: number) => (
                        <div key={`${nodeKey}_${index}_array`} style={{ marginBottom: "10px" }}>
                            <span style={{ marginLeft: "2rem" }}></span>
                            <input
                                onChange={event => handleUpdateValue(nodeKey, event.target.value, index)}
                                style={{ float: "right" }}
                                value={itemValue}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        if (!isExpandable) {
            return (
                <div key={nodeKey} style={{ marginBottom: "10px" }}>
                    <span>{nodeKey.split('.').slice(-1)[0]} :</span>
                    <input

                        onChange={event => handleUpdateValue(nodeKey, event.target.value)}
                        style={{ float: "right" }}
                        value={nodeValue}
                    />
                </div>
            );
        }

        return (
            <div key={nodeKey} style={{ marginBottom: "10px" }}>
                <span onClick={() => toggleItemExpansion(nodeKey)}>{nodeKey.split('.').slice(-1)[0]} :</span>
                {isExpanded && (
                    <div className="margin-left">
                        <Tree yamlData={nodeValue} propertyKey={nodeKey} handleUpdateValue={handleUpdateValue} />
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="flex-item padding-1 overflow-auto" style={{ marginBottom: "15px", minWidth: "300px" }}>
            {Object.entries(yamlData).map(([nodeKey, nodeValue]) => renderNode(nodeValue, propertyKey ? `${propertyKey}.${nodeKey}` : nodeKey))}
        </div>
    );
}

