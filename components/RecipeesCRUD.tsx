import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recipes Management</Text>

      {/* Input fields */}
      <TextInput
        placeholder="Recipe's Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <View>
        <Text style={styles.label}>Ingredients:</Text>
        {ingredients.map((ingredient, index) => {
          const [id, value] = ingredient.split(':');
          return (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                value={value}
                onChangeText={(text) => updateIngredient(index, text)}
                style={[styles.input, styles.ingredientInput]}
              />
              <TouchableOpacity onPress={() => deleteIngredient(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <Button title="Add Ingredient" onPress={addIngredient} />
      </View>
      <TextInput
        placeholder="Instructions"
        value={instructions}
        onChangeText={(text) => setInstructions(text)}
        style={[styles.input, styles.textArea]}
        multiline
      />

      {/* Action buttons */}
      {!selectedRecipeId ? (
        <Button title="Create" onPress={() => { createRecipe(); clearInputs(); }} />
      ) : (
        <View style={styles.actionButtons}>
          <Button title="Update" onPress={() => { updateRecipe(selectedRecipeId, name, ingredients, instructions); clearInputs(); }} />
          <Button title="Delete" onPress={() => { deleteRecipe(selectedRecipeId); clearInputs(); }} />
        </View>
      )}

      {/* Recipe list */}
      <Text style={styles.subtitle}>Recipes</Text>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={[
            styles.recipeCard,
            selectedRecipeId === recipe.id && styles.selectedRecipeCard,
          ]}
          onPress={() => handleRecipeClick(recipe)}
        >
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <Text>
            <Text style={styles.boldText}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, index) => {
              const [id, value] = ingredient.split(':');
              return (
                <Text key={index} style={styles.ingredientText}>{value}</Text>
              );
            })}
          </Text>
          <Text>
            <Text style={styles.boldText}>Instructions:</Text> {recipe.instructions}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10, width: '100%' },
  label: { fontWeight: 'bold', marginBottom: 5 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ingredientInput: { flex: 1, marginRight: 10 },
  deleteButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
  deleteButtonText: { color: 'white' },
  textArea: { height: 100, textAlignVertical: 'top' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
  recipeCard: { padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, width: '100%' },
  selectedRecipeCard: { backgroundColor: '#e0f7fa' },
  recipeTitle: { fontSize: 18, fontWeight: 'bold' },
  boldText: { fontWeight: 'bold' },
  ingredientText: { marginLeft: 10 },
});

export default RecipeesCRUD;