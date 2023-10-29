import React from "react";

interface Props {
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditChannel: React.FC<Props> = ({ setIsEditing }) => {
	return <div>EditChannel</div>;
};

export default EditChannel;
