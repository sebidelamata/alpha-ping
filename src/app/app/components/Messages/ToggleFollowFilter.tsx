import React from "react";

interface ToggleFollowFilterProps{
    followFilter: boolean;
    setFollowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleFollowFilter:React.FC<ToggleFollowFilterProps> = ({followFilter, setFollowFilter}) => {

    return (
        <div className="follows-toggle">
            <h4>Follows</h4>
            <label style={styles.switch} className="follows-toggle-switch">
            <input
                type="checkbox"
                checked={followFilter}
                onChange={() => setFollowFilter(!followFilter)}
                style={styles.input}
            />
            <span style={followFilter ? { ...styles.slider, ...styles.sliderOn } : styles.slider}></span>
            </label>
        </div>

      );
    }
    
    const styles = {
      switch: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        width: "50px",
        height: "24px",
      },
      label: {
        fontSize: "14px",
      },
      input: {
        display: "none",
      },
      slider: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgb(167, 165, 168, 0.8)",
        transition: "0.4s",
        borderRadius: "24px",
        cursor: "pointer",
        before: {
          content: '""',
          position: "absolute",
          width: "20px",
          height: "20px",
          left: "4px",
          bottom: "2px",
          backgroundColor: "#242424",
          borderRadius: "50%",
          transition: "0.4s",
        },
      },
      sliderOn: {
        backgroundColor: "rgb(188, 146, 222, 0.8)",
        transform: "translateX(26px)",
      },
    };

export default ToggleFollowFilter;