import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import ChannelsList from "./AllChannels";
import CreateChannel from "./NewChannel";
const HomePage = ()=> {
    const { authState } = useContext(AuthContext);
    return (
        <div>
            {
                authState.username === "admin" ?
                    (
                        <ChannelsList />
                    ) : (
                        
                            <CreateChannel />
                        
                    )}
        </div>
    );
}

export default HomePage;