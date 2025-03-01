import PasswordSetting from "./PasswordSetting";
import Profile from "./Profile";
import SessionManager from "./SessionManager";

const LandingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Sonner 2.0.1 Bug Reproduction
        </h1>
        <p className="text-gray-600">
          This demo shows an issue where toast notifications require multiple
          calls to appear
        </p>
        <div className="mt-2 bg-yellow-100 p-2 rounded text-sm">
          <strong>Issue:</strong> When using sonner v2.0.1, toast notifications
          require multiple function calls to appear
        </div>
      </header>

      <SessionManager />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Profile />
        </div>
        <div className="flex-1">
          <PasswordSetting />
        </div>
      </div>

      <div className="mt-8 p-4 border rounded bg-gray-50">
        <h2 className="font-bold mb-2">Debugging Information</h2>
        <p>sonner version: 2.0.1</p>
        <p>Check the console for toast function call logs</p>
      </div>
    </div>
  );
};

export default LandingPage;
