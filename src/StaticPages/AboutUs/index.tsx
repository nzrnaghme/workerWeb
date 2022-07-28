import "./index.scss";
import {
  par1,
  par2,
  par3,
  par4,
  par5,
  par6,
  par7,
  par8,
  par9,
  par10,
} from "./contents";
import { Title, Paragraph } from "../components";
import aboutUsImg from "../../Images/staticPages/about-us.png";

function AboutUs() {
  return (
    <div className="about-us">
      <Title>درباره ای‌رول، بیشتر بدانید</Title>
      <div className="par1-wrapper">
        <Paragraph>{par1}</Paragraph>
        <Paragraph>{par2}</Paragraph>
        <Paragraph>{par3}</Paragraph>
      </div>
      {/* <div className="about-video-wrapper"> */}
      {/* <video controls>
          <source src="movie.mp4" type="video/mp4" />
          <source src="movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video> */}

      <div>
        <img src={aboutUsImg} alt="about-us" />
      </div>
      {/* </div> */}
      <Paragraph>{par4}</Paragraph>
      <Paragraph>{par5}</Paragraph>
      <Paragraph>{par6}</Paragraph>
      <Paragraph>{par7}</Paragraph>
      <Paragraph>{par8}</Paragraph>
      <Paragraph>{par9}</Paragraph>
      <section className="about-lower-section">
        <Title>ای‌رول، همیار شما در مشکلات روزمره</Title>
        {/* <section className="about-lower-section-grid"> */}
        {/* <div className="about-last-paragraphs-wrapper"> */}
        <Paragraph>{par10}</Paragraph>
        {/* </div> */}

        {/* </section> */}
      </section>
    </div>
  );
}

export default AboutUs;
