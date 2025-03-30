import { useState, useEffect } from "react";
import { CreateCardForm } from "../components/CreateContentModal";
import { InputCard } from "../components/InputCard";
import { DeleteIcon } from "../components/Icons";
import { fetchBrains, deleteBrain, addBrain } from "../api/brain";

const validTypes = ["twitter", "youtube", "document", "web"] as const;

type ValidType = typeof validTypes[number];

const getValidType = (type: string): ValidType => {
  return validTypes.includes(type as ValidType) ? (type as ValidType) : "web";
};

interface Card {
  id: string;
  title: string;
  link: string;
  type: ValidType;
}

export default function BrainPage(): JSX.Element {
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrains = async () => {
      setLoading(true);
      try {
        const response = await fetchBrains();
        const savedCards = response.map((card: any) => ({
          id: card._id,
          title: card.title,
          link: card.link,
          type: getValidType(card.type),
        }));
        setCards(savedCards);
      } catch (err: any) {
        setError("Failed to load saved content.");
      } finally {
        setLoading(false);
      }
    };
    loadBrains();
  }, []);

  const handleAddCard = async (title: string, link: string, type: string) => {
    try {
      const newCard = await addBrain({ title, link, type: getValidType(type) });
      setCards((prevCards) => [...prevCards, {
        id: newCard._id,
        title,
        link,
        type: getValidType(type)
      }]);
    } catch (err) {
      setError("Failed to add content.");
    }
    setShowCreateCard(false);
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteBrain(id);
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    } catch (err) {
      setError("Failed to delete content.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <div className="w-full flex justify-between items-center p-4 mb-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">My Saved Content</h1>
        <button
          onClick={() => setShowCreateCard(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Add Content
        </button>
      </div>

      {showCreateCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={() => setShowCreateCard(false)}
            >
              <DeleteIcon />
            </button>
            <CreateCardForm onSubmit={handleAddCard} />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <DeleteIcon />
              </button>
              <InputCard {...card} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
