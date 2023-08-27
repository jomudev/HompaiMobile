import { Button, Heading, PressableLink, Text, View } from "../components/UI";
import AppAuth from "../../modules/Auth";

const logout = () => {
    AppAuth.getInstance().signOut();
}

export default function Logout(props) {
  return (
    <View>
      <Heading size="xl">Estás seguro que quieres salir?</Heading>
      <Button muted onPress={logout}>
        Sí, Salir
      </Button>
      <Button onPress={props.navigation.goBack}>
        Cancelar
      </Button>
    </View>
  )
}