import React, { useEffect, useRef } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

interface AutoCompleteProps {
  label?: string;
  error?: string;
  required?: boolean;

  onPress: (data: any, details: any) => void; // Handle selected place
  onChange?: (text: string) => void; // Handle manual text input
  placeholder?: string;
  value?: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  label,
  error,
  required = false,
  onPress,
  onChange,
  placeholder = "Search for a place",
  value = "",
}) => {
  const ref = useRef<GooglePlacesAutocompleteRef | null>(null);

  useEffect(() => {
    ref.current?.setAddressText(value);
  }, [value]);

  return (
    <View>
      {/* LABEL  */}
      {!!label && (
        <Text style={styles.label}>
          {label}
          {!!required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <GooglePlacesAutocomplete
        ref={ref} // Use the ref with the correct type
        placeholder={placeholder}
        minLength={2} // Minimum length of text to search
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails={true} // Fetch place details
        renderDescription={(row) => row.description} // Custom rendering of descriptions
        onPress={(data: any, details = null) => {
          onPress(data, details); // Call onPress with the selected place details
          // Optionally, set the selected place in the input
          if (details && ref.current) {
            ref.current.setAddressText(details.formatted_address);
          }
        }} // Callback on place selection
        textInputProps={{
          onChangeText: onChange,
          value: value,
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API || "", // Ensure your API key is available
          language: "en", // Language of the results
          types: "geocode",
        }}
        // @ts-ignore
        requestConfig={{
          headers: {
            Referer:
              process.env.EXPO_PUBLIC_WEBSITE_URL ||
              "https://review-system.quickreview.app",
          },
        }}
        enablePoweredByContainer={false}
        styles={{
          textInputContainer: {
            width: "100%",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            borderWidth: 1,
            borderColor: "#e5e7eb", // border-gray-200
            borderRadius: 8, // rounded-lg
            paddingHorizontal: 16, // px-4
            paddingVertical: 12, // py-3
            width: "100%",
            backgroundColor: "#ffffff", // bg-base-300
            color: "#374151", // text-gray-700
            fontSize: 14,
          },
          listView: {
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 4,
            zIndex: 1000,
            elevation: 5, // For Android
          },
        }}
        flatListProps={{
          scrollEnabled: false,
          keyboardShouldPersistTaps: "always",
        }}
        onFail={(error) =>
          console.log("GooglePlacesAutocomplete Error:", error)
        }
        nearbyPlacesAPI="GooglePlacesSearch" // Specify API for nearby places
        debounce={200} // Debounce the search for performance
      />

      {/* ERROR  */}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  required: {
    color: "red",
  },
  error: {
    color: "red",
    fontSize: 10,
  },
});

export default AutoComplete;
