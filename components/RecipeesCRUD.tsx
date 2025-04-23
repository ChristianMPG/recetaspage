import React, { useState, useEffect } from 'react';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../.env/firebaseConfig'; // Assuming this is where your Firestore instance is initialized

const inputStyle = { margin: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { margin: '5px', padding: '8px 12px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' };
const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' };

interface Recipe {
  id?: string; // Optional id for new recipes not yet in Firestore
  name: string;
  ingredients: string[]; // Changed to array of strings
  instructions: string;
}

const RecipeesCRUD: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]); // Changed to array of strings
  const [instructions, setInstructions] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Function to generate unique IDs for ingredients
  const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addIngredient = () => {
    const newId = generateUniqueId();
    setIngredients([...ingredients, `${newId}:`]);
  };

  const deleteIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    const [id] = updatedIngredients[index].split(":");
    updatedIngredients[index] = `${id}:${value}`;
    setIngredients(updatedIngredients);
  };

  const clearInputs = () => {
    setName('');
    setIngredients([]);
    setInstructions('');
    setSelectedRecipeId(null);
  };

  const createRecipe = async () => {
    try {
      // Filter out any empty ingredients before sending
      const filteredIngredients = ingredients.filter(ingredient => ingredient.split(':')[1].trim() !== '');
      
      // Extract only the ingredient names before sending to Firestore
      const ingredientNames = filteredIngredients.map(ingredient => ingredient.split(':')[1].trim());

      const docRef = await addDoc(collection(db, 'recipes'), { name, ingredients: ingredientNames, instructions });

      console.log('Document written with ID: ', docRef.id);
      readRecipes();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  
  const readRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipees'));
      const recipesData: Recipe[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        ingredients: doc.data().ingredients || [], // Ensure this is an array
        instructions: doc.data().instructions,
      }));
      setRecipes(recipesData);
    } catch (e) {
      console.error('Error getting documents:', e);
    }
  };

  const updateRecipe = async (id: string, name: string, ingredients: string[], instructions: string) => {
    try {
      const recipeRef = doc(db, 'recipees', id);
      await updateDoc(recipeRef, {
        name,
        // Extract only the ingredient names before sending to Firestore
        ingredients: ingredients.map(ingredient => ingredient.split(':')[1].trim()),


        instructions,
      });
      console.log('Document updated with ID: ', id);
      clearInputs()
      readRecipes();
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipees', id));
      console.log('Document deleted with ID: ', id);
      readRecipes();
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setName(recipe.name || "");
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setSelectedRecipeId(recipe.id);
  };

  useEffect(() => {
    readRecipes();
  }, []);

  return (
    <div style={containerStyle}>
      <h2>Recipes Management</h2>

      {/* Input fields */}
      <input
        type="text"
        placeholder="Recipe's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <div>
        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => {
          const [id, value] = ingredient.split(':');
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <input
                type="string"
                value={value}
                onChange={(e) => updateIngredient(index, e.target.value)}
                style={{ ...inputStyle, marginRight: '5px' }}
              />
              <button type="button" onClick={() => deleteIngredient(index)} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
                Delete
              </button>
            </div>
          );
        })}
        <button type="button" onClick={addIngredient} style={buttonStyle}>
          Add Ingredient
        </button>
      </div>
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        style={{ ...inputStyle, height: '120px' }}
      />

      {/* Action buttons */}
      {!selectedRecipeId ? (
        <button onClick={() => { createRecipe(); clearInputs(); }} style={buttonStyle}>Create</button>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => { updateRecipe(selectedRecipeId, name, ingredients, instructions); clearInputs(); }} style={buttonStyle}>Update</button>
          <button onClick={() => { deleteRecipe(selectedRecipeId); clearInputs(); }} style={buttonStyle}>Delete</button>
        </div>
        
      )}

      {/* Recipe list */}
      <h3>Recipes</h3>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: selectedRecipeId === recipe.id ? '#e0f7fa' : 'white',
            }}
            onClick={() => handleRecipeClick(recipe)}
          >
            <h4>{recipe.name}</h4>
            <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <strong>Ingredients:</strong>
              {recipe.ingredients.map((ingredient, index) => {
                  const [id, value] = ingredient.split(':');
                  return (
                    <span key={index} style={{ display: 'block', marginLeft: '20px' }}>{value}</span>
                  );
                })}
            </p>
             <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <strong>Instructions:</strong> {recipe.instructions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeesCRUD;