import "./index.scss";

function BusyFamilyAdventures() {
  return (
    <div className="busy-family-adventures">
      <div className="busy-family-video-wrapper">
        <video
          controls
          src="https://yootaab.ir/movies/busy-family-adventures.mp4"
        >
          <source src="movie.mp4" type="video/mp4" />
          <source src="movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default BusyFamilyAdventures;
