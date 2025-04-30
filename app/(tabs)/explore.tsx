import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { View, Text, ScrollView } from "react-native";

import React from 'react';
import RecipeesCRUD from '../../components/RecipeesCRUD';    
      const MyPage: React.FC = () => {
        return (
          <ScrollView>
            
            <RecipeesCRUD />
            
          </ScrollView>
        );
      };
   
      export default MyPage;
   