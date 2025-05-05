
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        
        <p className="text-gray-500 mb-8">
          A página <span className="font-medium text-gray-700">{location.pathname}</span> não existe ou foi removida.
          {location.pathname === '/payment-success' && (
            <span className="block mt-2 text-blue-600">
              Tente acessar a página <Link to="/success" className="underline">success</Link> em vez disso.
            </span>
          )}
        </p>
        
        <Button asChild variant="default" className="w-full">
          <Link to="/" className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
