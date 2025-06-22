'use client';

import { useState } from 'react';
import Script from 'next/script';

interface Project {
  id: string;
  name: string;
}

interface TestClientProps {
  projects: Project[];
}

export default function TestClient({ projects }: TestClientProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <>
      {selectedProjectId && (
        <Script
          src="/track.js"
          data-site={selectedProjectId}
          strategy="afterInteractive"
          key={selectedProjectId} // Force re-render on project change
        />
      )}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Who&apos;s Viewing Me - Interactive Test Page
          </h1>
          
          {projects.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <label htmlFor="project-select" className="block text-xl font-semibold mb-4 text-gray-700">Select Project to Test</label>
                <select
                  id="project-select"
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Tracking is Active</h2>
                  <p className="text-green-700">
                    The tracking script for project &quot;<strong>{selectedProject.name}</strong>&quot; is now active on this page.
                  </p>
                  <p className="text-green-700 mt-2">
                    Check your dashboard&apos;s Live Feed to see this visit!
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">⚠️ Action Required</h2>
              <p className="text-yellow-700">
                Please create a project in your dashboard first to use this test page.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How This Works</h2>
            <p className="text-gray-600">
              This page lets you select any of your projects from the dropdown. It then dynamically loads the correct tracking script for that specific project.
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 