import React, { useEffect, useState } from 'react';
import { Layout, Text } from '../components/UI';
import { Link, StackActions } from '@react-navigation/native';
import PantryStore from '../../modules/PantryStore';
const store = PantryStore.getInstance();

export default function Pantries (props) {
  const [pantries, setPantries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const pantries = await store.getPantries();
      setPantries(pantries);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {
        pantries.map(pantry => (
          <Link 
            to={{ screen: "Pantry", params: pantry }}
            key={pantry.id}
            >
            {pantry.name}
          </Link>
        ))
      }
    </Layout>
  );
}