import React from "react";

interface Props {
	createType?: string;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateChannel: React.FC<Props> = ({ createType, setIsCreating }) => {
	return <div>CreateChannel</div>;
};

export default CreateChannel;
