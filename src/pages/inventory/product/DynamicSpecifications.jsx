// // components/DynamicSpecifications.jsx
// import { useState, useEffect } from 'react';
// import { Plus, X } from 'lucide-react';

// export default function DynamicSpecifications({
//     categoryId,
//     subCategoryId,
//     onChange,
//     initialSpecs = {}
// }) {
//     const [specifications, setSpecifications] = useState([]);

//     // Static attributes based on category
//     const attributesByCategory = {
//         // For category ID "1" (t-shirt)
//         "1": {
//             size: {
//                 type: 'select',
//                 options: ['S', 'M', 'L', 'XL', 'XXL'],
//                 label: 'Size',
//                 required: true
//             },
//             fabric: {
//                 type: 'select',
//                 options: ['Cotton', 'Polyester', 'Cotton Blend', 'Linen'],
//                 label: 'Fabric',
//                 required: true
//             },
//             fit: {
//                 type: 'select',
//                 options: ['Regular', 'Slim', 'Oversized', 'Relaxed'],
//                 label: 'Fit',
//                 required: true
//             },
//             neckType: {
//                 type: 'select',
//                 options: ['Round Neck', 'V-Neck', 'Polo', 'Turtle Neck'],
//                 label: 'Neck Type',
//                 required: false
//             },
//             sleeveLength: {
//                 type: 'select',
//                 options: ['Short Sleeve', 'Long Sleeve', 'Half Sleeve', 'Sleeveless'],
//                 label: 'Sleeve Length',
//                 required: true
//             },
//             pattern: {
//                 type: 'select',
//                 options: ['Solid', 'Printed', 'Striped', 'Checkered', 'Floral'],
//                 label: 'Pattern',
//                 required: false
//             }
//         },

//         // For category ID "2" (shirt)
//         "2": {
//             size: {
//                 type: 'select',
//                 options: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
//                 label: 'Size',
//                 required: true
//             },
//             fabric: {
//                 type: 'select',
//                 options: ['Cotton', 'Linen', 'Polyester', 'Silk', 'Denim'],
//                 label: 'Fabric',
//                 required: true
//             },
//             fit: {
//                 type: 'select',
//                 options: ['Regular', 'Slim', 'Tailored', 'Classic'],
//                 label: 'Fit',
//                 required: true
//             },
//             collarType: {
//                 type: 'select',
//                 options: ['Spread Collar', 'Cutaway Collar', 'Button Down', 'Mandarin Collar', 'Wing Collar'],
//                 label: 'Collar Type',
//                 required: true
//             },
//             sleeveLength: {
//                 type: 'select',
//                 options: ['Full Sleeve', 'Half Sleeve', 'Roll Up Sleeve'],
//                 label: 'Sleeve Length',
//                 required: true
//             },
//             pattern: {
//                 type: 'select',
//                 options: ['Solid', 'Checked', 'Striped', 'Printed', 'Self Design'],
//                 label: 'Pattern',
//                 required: false
//             }
//         },

//         // For category ID "3" (lower)
//         "3": {
//             size: {
//                 type: 'select',
//                 options: ['28', '30', '32', '34', '36', '38', '40', '42'],
//                 label: 'Size (Waist)',
//                 required: true
//             },
//             length: {
//                 type: 'select',
//                 options: ['Full Length', 'Cropped', 'Ankle Length', 'Shorts'],
//                 label: 'Length',
//                 required: true
//             },
//             fabric: {
//                 type: 'select',
//                 options: ['Cotton', 'Denim', 'Polyester', 'Linen', 'Corduroy'],
//                 label: 'Fabric',
//                 required: true
//             },
//             fit: {
//                 type: 'select',
//                 options: ['Regular', 'Slim', 'Straight', 'Bootcut', 'Skinny', 'Relaxed'],
//                 label: 'Fit',
//                 required: true
//             },
//             closureType: {
//                 type: 'select',
//                 options: ['Zip Fly', 'Button Fly', 'Drawstring', 'Elastic'],
//                 label: 'Closure Type',
//                 required: true
//             },
//             pocketStyle: {
//                 type: 'select',
//                 options: ['Side Pockets', 'Back Pockets', 'Cargo Pockets', 'No Pockets'],
//                 label: 'Pocket Style',
//                 required: false
//             }
//         }
//     };

//     // Get current category attributes
//     const currentAttributes = attributesByCategory[categoryId] || {};

//     // Initialize specifications when category changes
//     useEffect(() => {
//         if (categoryId && Object.keys(currentAttributes).length > 0) {
//             // Create specifications from initial values or empty
//             const initialSpecsList = [];

//             // If we have initial specs, use them
//             if (Object.keys(initialSpecs).length > 0) {
//                 Object.entries(initialSpecs).forEach(([key, value]) => {
//                     if (currentAttributes[key]) {
//                         initialSpecsList.push({
//                             id: Date.now() + Math.random(),
//                             key,
//                             value
//                         });
//                     }
//                 });
//             }

//             // If no initial specs, create empty ones for required attributes
//             if (initialSpecsList.length === 0) {
//                 Object.entries(currentAttributes).forEach(([key, attr]) => {
//                     if (attr.required) {
//                         initialSpecsList.push({
//                             id: Date.now() + Math.random(),
//                             key,
//                             value: ''
//                         });
//                     }
//                 });
//             }

//             setSpecifications(initialSpecsList);
//         } else {
//             setSpecifications([]);
//         }
//     }, [categoryId]);

//     // Update parent when specifications change
//     useEffect(() => {
//         const specsObject = {};
//         specifications.forEach(spec => {
//             if (spec.key && spec.value) {
//                 specsObject[spec.key] = spec.value;
//             }
//         });
//         onChange(specsObject);
//     }, [specifications]);

//     const addSpecification = () => {
//         // Find an attribute that's not already added
//         const existingKeys = specifications.map(s => s.key);
//         const availableAttributes = Object.keys(currentAttributes).filter(
//             key => !existingKeys.includes(key)
//         );

//         if (availableAttributes.length > 0) {
//             const newSpec = {
//                 id: Date.now(),
//                 key: availableAttributes[0],
//                 value: ''
//             };
//             setSpecifications([...specifications, newSpec]);
//         } else {
//             alert('All attributes are already added!');
//         }
//     };

//     const removeSpecification = (id) => {
//         setSpecifications(specifications.filter(spec => spec.id !== id));
//     };

//     const updateSpecification = (id, field, value) => {
//         setSpecifications(specifications.map(spec =>
//             spec.id === id ? { ...spec, [field]: value } : spec
//         ));
//     };

//     // Get available attributes for the select dropdown
//     const getAvailableAttributes = () => {
//         const existingKeys = specifications.map(s => s.key);
//         return Object.keys(currentAttributes).filter(key => !existingKeys.includes(key));
//     };

//     // Get attribute label
//     const getAttributeLabel = (key) => {
//         return currentAttributes[key]?.label || key;
//     };

//     // Get attribute options
//     const getAttributeOptions = (key) => {
//         return currentAttributes[key]?.options || [];
//     };

//     if (!categoryId) {
//         return (
//             <div className="text-center py-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
//                 <p className="text-sm text-gray-500">
//                     Please select a category first to see specifications
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-4">
//             <div className="flex justify-between items-center">
//                 <label className="block text-sm font-medium text-gray-700">
//                     Product Specifications
//                 </label>
//                 {getAvailableAttributes().length > 0 && (
//                     <button
//                         type="button"
//                         onClick={addSpecification}
//                         className="flex items-center gap-1 text-sm text-[#927f68] hover:text-[#7b6b57]"
//                     >
//                         <Plus size={16} />
//                         Add Specification
//                     </button>
//                 )}
//             </div>

//             {specifications.map((spec) => (
//                 <div key={spec.id} className="flex gap-3 items-start">
//                     <div className="flex-1">
//                         <div className="text-sm font-medium text-gray-600 mb-1">
//                             {getAttributeLabel(spec.key)}
//                         </div>
//                         {currentAttributes[spec.key]?.type === 'select' ? (
//                             <select
//                                 value={spec.value}
//                                 onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
//                                 required={currentAttributes[spec.key]?.required}
//                                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
//                             >
//                                 <option value="">Select {getAttributeLabel(spec.key)}</option>
//                                 {getAttributeOptions(spec.key).map(option => (
//                                     <option key={option} value={option}>{option}</option>
//                                 ))}
//                             </select>
//                         ) : (
//                             <input
//                                 type="text"
//                                 value={spec.value}
//                                 onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
//                                 placeholder={`Enter ${getAttributeLabel(spec.key)}`}
//                                 required={currentAttributes[spec.key]?.required}
//                                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
//                             />
//                         )}
//                     </div>

//                     {!currentAttributes[spec.key]?.required && (
//                         <button
//                             type="button"
//                             onClick={() => removeSpecification(spec.id)}
//                             className="p-2 text-gray-400 hover:text-red-500 mt-6"
//                         >
//                             <X size={18} />
//                         </button>
//                     )}
//                 </div>
//             ))}

//             {specifications.length === 0 && (
//                 <div className="text-center py-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
//                     <p className="text-sm text-gray-500">
//                         No specifications available for this category
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// }



// components/DynamicSpecifications.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import api from "../../../serviceAuth/axios";

export default function DynamicSpecifications({
    subCategoryId,
    onChange,
    initialSpecs = {}
}) {
    const [specifications, setSpecifications] = useState([]);
    const [attributes, setAttributes] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch attributes when subcategory changes
    useEffect(() => {
        if (subCategoryId) {
            fetchSubCategoryAttributes();
        } else {
            setAttributes({});
            setSpecifications([]);
        }
    }, [subCategoryId]);

    const fetchSubCategoryAttributes = async () => {
        if (!subCategoryId) return;
        
        setLoading(true);
        try {
            // Get subcategory details to fetch its attributes
            const response = await api.get(`/subcategory/${subCategoryId}`);
            if (response.data.success) {
                const subCategory = response.data.category;
                if (subCategory?.attributes) {
                    setAttributes(subCategory.attributes);
                    
                    // Initialize specifications from subcategory attributes
                    const initialSpecsList = [];
                    
                    // If we have initial specs, use them
                    if (Object.keys(initialSpecs).length > 0) {
                        Object.entries(initialSpecs).forEach(([key, value]) => {
                            if (subCategory.attributes[key]) {
                                initialSpecsList.push({
                                    id: Date.now() + Math.random(),
                                    key,
                                    value
                                });
                            }
                        });
                    }
                    
                    // If no initial specs, create empty ones for required attributes
                    if (initialSpecsList.length === 0) {
                        Object.entries(subCategory.attributes).forEach(([key, attr]) => {
                            if (attr.required) {
                                initialSpecsList.push({
                                    id: Date.now() + Math.random(),
                                    key,
                                    value: ''
                                });
                            }
                        });
                    }
                    
                    setSpecifications(initialSpecsList);
                }
            }
        } catch (error) {
            console.error('Error fetching subcategory attributes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update parent when specifications change
    useEffect(() => {
        const specsObject = {};
        specifications.forEach(spec => {
            if (spec.key && spec.value) {
                specsObject[spec.key] = spec.value;
            }
        });
        onChange(specsObject);
    }, [specifications, onChange]);

    const addSpecification = () => {
        const existingKeys = specifications.map(s => s.key);
        const availableAttributes = Object.keys(attributes).filter(
            key => !existingKeys.includes(key)
        );

        if (availableAttributes.length > 0) {
            const newSpec = {
                id: Date.now(),
                key: availableAttributes[0],
                value: ''
            };
            setSpecifications(prev => [...prev, newSpec]);
        }
    };

    const removeSpecification = (id) => {
        setSpecifications(prev => prev.filter(spec => spec.id !== id));
    };

    const updateSpecification = (id, field, value) => {
        setSpecifications(prev => prev.map(spec =>
            spec.id === id ? { ...spec, [field]: value } : spec
        ));
    };

    const getAvailableAttributes = () => {
        const existingKeys = specifications.map(s => s.key);
        return Object.keys(attributes).filter(key => !existingKeys.includes(key));
    };

    if (!subCategoryId) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500">
                    Please select a subcategory first to see specifications
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-6">
                <p className="text-sm text-gray-500">Loading specifications...</p>
            </div>
        );
    }

    if (Object.keys(attributes).length === 0) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500">
                    No specifications available for this subcategory
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                    Product Specifications
                </label>
                {getAvailableAttributes().length > 0 && (
                    <button
                        type="button"
                        onClick={addSpecification}
                        className="flex items-center gap-1 text-sm text-[#927f68] hover:text-[#7b6b57]"
                    >
                        <Plus size={16} />
                        Add Specification
                    </button>
                )}
            </div>

            {specifications.map((spec) => {
                const attr = attributes[spec.key];
                if (!attr) return null;

                return (
                    <div key={spec.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-600 mb-1 capitalize">
                                {spec.key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <select
                                value={spec.value}
                                onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                                required={attr.required}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                            >
                                <option value="">Select {spec.key}</option>
                                {attr.values?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {!attr.required && (
                            <button
                                type="button"
                                onClick={() => removeSpecification(spec.id)}
                                className="p-2 text-gray-400 hover:text-red-500 mt-6"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                );
            })}

            {specifications.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                        Click "Add Specification" to add product details
                    </p>
                </div>
            )}
        </div>
    );
}