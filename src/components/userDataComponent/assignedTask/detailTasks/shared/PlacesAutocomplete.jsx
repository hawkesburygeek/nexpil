import React, { useEffect } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useState } from 'react';

const PlacesAutocomplete = (props) => {

    const [cursor, setCursor] = useState(0);
    const [open, setOpen] = useState(true);

    const { address, onChangeAddress } = props;

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
    });

    console.log("ready === ", ready)
    console.log("status === ", status)
    console.log("data === ", data)

    useEffect(() => {
        onChangeAddress(value);
    }, [value]);
    useEffect(() => {
        setValue(address);
    }, []);

    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });

    const handleInput = (e) => {
        if (e.target.value) setOpen(true);
        // Update the keyword of the input element
        setValue(e.target.value);
    };

    const handleSelect = ({ description }) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                console.log("📍 Coordinates: ", { lat, lng });
            })
            .catch((error) => {
                console.log("😱 Error: ", error);
            });
    };


    const handleKeyDown = (e) => {
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38 && cursor > 0) setCursor(cursor - 1);
        else if (e.keyCode === 40 && cursor < data.length - 1) setCursor(cursor + 1);
        else if (e.keyCode === 13) {
            setCursor(0);
            setOpen(false);
            console.log("data[cursor] --- ", data[cursor]);
            const { description } = data[cursor];
            setValue(description)
        }
    }
    return (
        <div ref={ref}>
            <input
                className="add-inputs"
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Address"
                onKeyDown={handleKeyDown}
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {
                status === "OK" && open ?
                    <ul style={{
                        marginTop: "2px",
                        width: "95%",
                        position: "absolute",
                        background: "white",
                        borderRadius: "20px",
                        boxShadow: "0px 4px 8px #0000001a",
                        zIndex: "1000",
                        listStyleType: "none",
                        textAlign: "left",
                        overflowY: "auto",
                        paddingright: "1.5em"
                    }}>
                        {
                            data.map((suggestion, index) => {
                                const {
                                    place_id,
                                    structured_formatting: { main_text, secondary_text },
                                } = suggestion;

                                return (
                                    <li key={place_id} onClick={handleSelect(suggestion)} style={{
                                        cursor: "pointer",
                                        background: "none",
                                        color: cursor === index && "#4939E3"
                                    }}>
                                        <strong>{main_text}</strong> <small>{secondary_text}</small>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    : null
            }
        </div >
    );
};

export default PlacesAutocomplete