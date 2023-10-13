import React, { useEffect, useState } from 'react';
import { Layout, Text, PressableLink, View } from '../components/UI';
import PantryStore from '../../modules/PantryStore';
import sizes from '../../res/sizes';


export default function Pantries (props) {
  const [pantries, setPantries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const pantries = await PantryStore.getPantries();
      setPantries(pantries);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <View scrollable>
        {
          pantries.map(pantry => (
            <PressableLink
              to={{ screen: "Pantry", params: pantry }}
              key={pantry.id}
              style={{
                padding: sizes.xl,
                width: '100%',
                textAlign: 'center',
              }}
              >
              <Text>{pantry.name}</Text>
            </PressableLink>
          ))
        }
      </View>
    </Layout>
  );
}