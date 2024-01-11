const getInitials = (value) => typeof value === "string" 
  ? value.split(" ").map(word => word[0]?.toUpperCase()) : value;

  export default getInitials;