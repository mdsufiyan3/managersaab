'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import {
  RiCodeSSlashLine,
  RiBookmarkLine,
  RiFileCopyLine,
  RiArrowRightSLine,
  RiTerminalBoxLine,
  RiLockLine,
  RiRestartLine,
  RiCheckLine
} from 'react-icons/ri';

// API Documentation Sections
const apiSections = [
  {
    title: 'Authentication',
    description: 'Learn how to authenticate your API requests',
    icon: RiLockLine,
    content: {
      endpoint: '/api/auth/token',
      method: 'POST',
      parameters: [
        { name: 'client_id', type: 'string', required: true, description: 'Your API client ID' },
        { name: 'client_secret', type: 'string', required: true, description: 'Your API client secret' }
      ],
      example: `
curl -X POST https://api.example.com/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret"
  }'`
    }
  },
  {
    title: 'Create Order',
    description: 'Create a new shipping order',
    icon: RiTerminalBoxLine,
    content: {
      endpoint: '/api/orders',
      method: 'POST',
      parameters: [
        { name: 'customer_name', type: 'string', required: true, description: 'Name of the customer' },
        { name: 'delivery_address', type: 'object', required: true, description: 'Delivery address details' },
        { name: 'items', type: 'array', required: true, description: 'Array of items to be shipped' }
      ],
      example: `
curl -X POST https://api.example.com/orders \\
  -H "Authorization: Bearer your_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_name": "John Doe",
    "delivery_address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    },
    "items": [
      {
        "id": "ITEM001",
        "quantity": 2
      }
    ]
  }'`
    }
  },
  {
    title: 'Track Order',
    description: 'Get real-time tracking information',
    icon: RiRestartLine,
    content: {
      endpoint: '/api/orders/{order_id}/track',
      method: 'GET',
      parameters: [
        { name: 'order_id', type: 'string', required: true, description: 'Unique order identifier' }
      ],
      example: `
curl -X GET https://api.example.com/orders/ORD123/track \\
  -H "Authorization: Bearer your_token"`
    }
  }
];

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState('api-docs');
  const [selectedSection, setSelectedSection] = useState(apiSections[0].title);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, section: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(section);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">API Documentation</h1>
            <p className="text-gray-400 mt-2">Integrate our shipping services into your application</p>
          </div>

          {/* API Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apiSections.map((section) => (
              <motion.div
                key={section.title}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSection(section.title)}
                className={`p-6 rounded-xl border cursor-pointer transition-all
                  ${selectedSection === section.title
                    ? 'bg-white/10 border-blue-500'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
              >
                <section.icon className="text-2xl text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                <p className="text-sm text-gray-400">{section.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Documentation Content */}
          {apiSections.map((section) => (
            selectedSection === section.title && (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">{section.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">{section.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        section.content.method === 'GET' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {section.content.method}
                      </span>
                      <span className="text-gray-400">{section.content.endpoint}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Parameters */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Parameters</h3>
                      <div className="bg-white/5 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                              <th className="px-6 py-3 text-sm font-medium">Parameter</th>
                              <th className="px-6 py-3 text-sm font-medium">Type</th>
                              <th className="px-6 py-3 text-sm font-medium">Required</th>
                              <th className="px-6 py-3 text-sm font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.content.parameters.map((param, index) => (
                              <tr key={index} className="border-b border-white/5">
                                <td className="px-6 py-4 text-sm text-white font-medium">
                                  {param.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-blue-400">
                                  {param.type}
                                </td>
                                <td className="px-6 py-4">
                                  {param.required ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                                      Optional
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                  {param.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Example Request</h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopyCode(section.content.example, section.title)}
                          className="flex items-center space-x-2 px-3 py-1 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copiedCode === section.title ? (
                            <>
                              <RiCheckLine className="text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <RiFileCopyLine className="text-gray-400" />
                              <span className="text-gray-400">Copy code</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                      <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-gray-300 whitespace-pre">
                          {section.content.example}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </main>
    </div>
  );
}
