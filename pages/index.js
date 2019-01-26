import fetch from "isomorphic-unfetch";
import cheerio from "cheerio";
import FormData from "form-data";

const carBlacklist = [
  "hybrid", // Want BEV only
  "tazzari" // This is not a general use vehicle
];

const Page = ({ cars }) => (
  <div className="root" key="index">
    <h1>Rafbílar</h1>

    {cars.map(car => (
      <a key={car.link} href={car.link}>
        <img src={car.image} />

        <div className="content">
          <p className="title">
            <span className="make">{car.make.toLowerCase()}</span>{" "}
            {car.model.toLowerCase()}
          </p>

          {car.modelExtra && (
            <p className="extra">{car.modelExtra.toLowerCase()}</p>
          )}

          <p className="extra">
            <span className="price">{car.price} kr. </span>

            {car.date.split("/")[1]}

            {car.milage && ` • ${car.milage}`}
          </p>
        </div>
      </a>
    ))}

    <style jsx global>{`
      body {
        font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
        color: #111;
      }
    `}</style>

    <style jsx>{`
      .root {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin 0 auto;
        max-width: 560px;
        padding: 24px;
      }
      h1 {
        font-size: 40px;
        font-weight: 600;
      }
      a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5%;
        text-decoration: none;
        color: inherit;
      }
      img {
        width: 30%;
        border-radius: 2px;
        object-fit: cover;
        margin-right: 4%;
        background-color: #F8F8F8;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }
      .content {
      }
      .title {
        font-size: 24px;
        color: #111;
        text-transform: capitalize;
        margin: 0;
        margin-bottom: 4px;
      }
      .make {
        font-weight: 600;
      }
      .extra {
        margin: 0 0 6px;
        color: #AAA;
        text-transform: capitalize;
        font-weight: 300;
      }
      .price {
        color: #111;
        font-weight: 500;
      }
    `}</style>
  </div>
);

Page.getInitialProps = async ({ req }) => {
  var form = new FormData();
  form.append("ctl00_contentSearchEngine_ctl00_search_fe", "1");

  const res = await fetch("https://bilasolur.is/Section.aspx?s=1", {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body:
      "__VIEWSTATE=%2FwEPDwULLTEwMTg4OTM5MjlkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYPBSVjdGwwMCRMb2dpblZpZXcxJGxvZ2luRm9ybSRSZW1lbWJlck1lBSpjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF94bWEFKmN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX3htbQUrY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZnRfMAUrY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZnRfMQUpY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZmUFKWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2ZoBSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfMAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzEFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8xNAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzgFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8yOAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzIFLGN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8zBSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfNKOZpV4%2BDwHqftYBSHd8irWHmjM0eVxLyBvG0Gx197tY&ctl00%24contentSearchEngine%24ctl00%24search_fe=on&ctl00%24contentSearchEngine%24ctl00%24btnSearch=Leita"
  });

  const cars = [];

  cheerio
    .load(await res.text())(".sr-item")
    .each((i, element) => {
      const parsedElement = cheerio(element);
      const link = parsedElement.find(".sr-link").attr("href");
      if (!link) {
        // There are .sr-link items that are not car listings
        return;
      }

      const imageSrc = parsedElement.find("img.swiper-slide").attr("src");

      const model = parsedElement
        .find(".car-make-and-model")
        .text()
        .replace(parsedElement.find(".car-make").text(), "")
        .trim();

      const details = parsedElement.find(".tech-details div");

      cars.push({
        image: imageSrc && `https://bilasolur.is/${imageSrc}`,
        link: link && `https://bilasolur.is/${link}`,
        make: parsedElement.find(".car-make").text(),
        model: model.split(" ")[0],
        modelExtra: model
          .split(" ")
          .slice(1)
          .join(" "),
        date: cheerio(details[0])
          .text()
          .split(" · ")[0],
        milage: cheerio(details[1])
          .text()
          .split(" · ")[0],
        price: parsedElement.find(".car-price span").text()
      });
    });

  return {
    cars: cars.filter(
      car =>
        carBlacklist.every(make => !car.make.toLowerCase().includes(make)) &&
        carBlacklist.every(make => !car.model.toLowerCase().includes(make)) &&
        carBlacklist.every(make => !car.modelExtra.toLowerCase().includes(make))
    )
  };
};

export default Page;
