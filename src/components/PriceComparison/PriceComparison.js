import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { compareShoppingListPrices, getBestShoppingOption } from '../services/api';

const PriceComparison = ({ shoppingList }) => {
  const [comparisons, setComparisons] = useState([]);
  const [bestOption, setBestOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shoppingList?.id) {
      loadComparisons();
    }
  }, [shoppingList]);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener comparación de precios
      const priceComparisons = await compareShoppingListPrices(shoppingList.id);
      setComparisons(priceComparisons);

      // Obtener la mejor opción
      const bestShoppingOption = await getBestShoppingOption(shoppingList.id);
      setBestOption(bestShoppingOption);

    } catch (err) {
      setError('Error al cargar las comparaciones de precios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4" />
            <p>Calculando mejores precios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-red-600">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comparación de Precios por Comercio</CardTitle>
      </CardHeader>
      <CardContent>
        {bestOption && (
          <div className="mb-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">
              Mejor Opción: {bestOption.shopName}
            </h3>
            <p className="text-green-600">
              Precio Total: ${bestOption.totalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              Productos disponibles: {bestOption.availableItems} de {shoppingList.items.length}
            </p>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <BarChart
            width={600}
            height={300}
            data={comparisons}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shopName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPrice" name="Precio Total" fill="#2196f3" />
          </BarChart>
        </div>

        <div className="mt-8 space-y-4">
          {comparisons.map((shop) => (
            <div 
              key={shop.shopId} 
              className={`p-4 border rounded-lg ${
                bestOption?.shopId === shop.shopId ? 'border-green-500 bg-green-50' : ''
              }`}
            >
              <h3 className="font-semibold">{shop.shopName}</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Producto</th>
                      <th className="p-2">Cantidad</th>
                      <th className="p-2">Precio Unit.</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shop.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item.itemName}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">${item.price?.toFixed(2) || 'N/A'}</td>
                        <td className="p-2">${item.total?.toFixed(2) || 'N/A'}</td>
                        <td className="p-2">
                          {item.available ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold">
                      <td colSpan="3" className="p-2 text-right">Total:</td>
                      <td className="p-2">${shop.totalPrice.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceComparison;