export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using ReelMate, you accept and agree to be bound by the terms and provision 
              of this agreement.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily download one copy of ReelMate for personal, 
              non-commercial transitory viewing only.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Account</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Description</h2>
            <p className="text-gray-600 mb-4">
              ReelMate provides AI-powered user-generated content video generation services. 
              We reserve the right to modify or discontinue the service at any time.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:zubairkhawer@gmail.com" className="text-blue-600 hover:underline">
                zubairkhawer@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
