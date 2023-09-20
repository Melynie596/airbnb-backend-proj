import { useDispatch, useSelector } from "react-redux";



const SpotDetailPage = () => {
    const dispatch = useDispatch();
    const spotDetails = Object.values(useSelector((state) => state?.spot?.spot))
    console.log(spotDetails);
    return (
        <div></div>
    );
}

export default SpotDetailPage;
