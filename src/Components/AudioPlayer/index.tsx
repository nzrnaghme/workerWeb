import AudioPlayer from "material-ui-audio-player";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  direction: "ltr",
  // palette: {
  //   primary: { main: "#00707e" },
  //   secondary: { main: "#969696" },
  // },
});

const useStyles = makeStyles((theme: any) => {
  return {
    root: {
      width: "14rem",
      display: "flex",
      alignItems: "center",
      background: "#eff0f2",
      opacity: ".75",
      padding: ".5rem 0",
      borderRadius: "0.5rem",

      "&>div:first-of-type": {
        boxSizing: "border-box",
        padding: "0px",
        // paddingRight: "0.25rem",
      },

      "&>div:nth-of-type(2)": {
        boxSizing: "border-box",
        padding: "0px",
        marginRight: "0",
      },

      "&>div:last-of-type": {
        boxSizing: "border-box",
        padding: "0px",
        marginLeft: "0.25rem",

        "& div": {
          padding: 0,

          "& p": {
            fontSize: "0.75rem",
            margin: ".25rem 0",
          },
        },

        "&>div:first-of-type": {
          marginRight: "0.65rem",
        },

        "&>div:nth-of-type(2)": {
          flex: "none",
          width: "6.25rem",
        },

        "&>div:last-of-type": {
          marginLeft: "0.65rem",
        },

        // "&>div:nth-of-type(2)": {
        //   "& span": {
        //     padding: "7px 0",
        //   },
        // },
      },
    },
    // loopIcon: {
    //   fontSize: "2rem",
    //   color: "#3f51b5",
    //   "&.selected": {
    //     color: "#0921a9",
    //   },
    //   "&:hover": {
    //     color: "#7986cb",
    //   },
    //   [theme.breakpoints.down("sm")]: {
    //     display: "none",
    //   },
    // },

    playIcon: {
      fontSize: "2rem",
      color: "#444343",

      "&:hover": {
        color: "#00434b",
      },
    },

    replayIcon: {
      fontSize: "2rem",
      color: "#444343",

      "&:hover": {
        color: "#00434b",
      },
    },
    pauseIcon: {
      fontSize: "2rem",
      color: "#444343",

      "&:hover": {
        color: "#00434b",
      },
    },
    volumeIcon: {
      fontSize: "2rem",
      color: "#444343",

      "&:hover": {
        color: "#00434b",
      },
    },
    volumeSlider: {
      color: "#444343",
    },

    progressTime: {
      color: "#444343",
    },

    mainSlider: {
      color: "#444343",

      //   "& .MuiSlider-rail": {
      //     color: "#444343",
      //   },
      //   "& .MuiSlider-track": {
      //     color: "#444343",
      //   },
      //   "& .MuiSlider-thumb": {
      //     color: "#00434b",
      //   },
    },
  };
});

type Props = { src: string; className?: string };

function OurAudioPlayer({ src, className }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <div className={className} dir="ltr">
        <AudioPlayer
          elevation={0}
          spacing={2}
          src={src}
          width="100%"
          variation="default"
          order="standart"
          useStyles={useStyles}
          volume={false}
          //   download={true}
          //   autoplay={true}
          //   preload="auto"
          //   loop={true}
        />
      </div>
    </ThemeProvider>
  );
}

export default OurAudioPlayer;
