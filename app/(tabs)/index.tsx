// app/(tabs)/index.tsx
import { useEffect, useState } from "react";
import { GetRecipesUseCase } from "@/recipees/application/GetRecipesUseCase";
import { RecipeRepository } from "@/recipees/infrastructure/recipeeRepository";
import { Recipe } from "@/recipees/domain/Recipe";
import { View, Text, ScrollView } from "react-native";
import RecipeesCard from "@/components/RecipeesCard";

export default function IndexScreen() {


  return (
    <ScrollView>
     <RecipeesCard></RecipeesCard>
    </ScrollView>
  );
}