import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

   // Por ejemplo, en app/(tabs)/index.tsx o en otro componente donde desees usarlo.
import React from 'react';
import RecipeesCRUD from '../../components/RecipeesCRUD'; // Asegúrate que la ruta es correcta
   
      const MyPage: React.FC = () => {
        return (
          <div>
            {/* ... otro contenido ... */}
            <RecipeesCRUD />
            {/* ... otro contenido ... */}
          </div>
        );
      };
   
      export default MyPage;
   