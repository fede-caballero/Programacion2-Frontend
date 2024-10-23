import React from 'react';
import { View, Text } from 'react-native';

const RoleBasedAccessControl = ({ children, allowedRoles, userRole }) => {
  if (allowedRoles.includes(userRole)) {
    return children;
  }
  return (
    <View>
      <Text>No tienes permiso para ver este contenido.</Text>
    </View>
  );
};

export default RoleBasedAccessControl;