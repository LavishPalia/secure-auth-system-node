import jsdom from "jsdom";
import createDOMPurify from "dompurify";
const { JSDOM } = jsdom;

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Middleware for sanitizing request body, query, params
export const sanitizeRequest = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      } else {
        obj[key] = DOMPurify.sanitize(obj[key]);
      }
    }
  };
  if (req.body) {
    sanitize(req.body);
  }
  if (req.query) {
    sanitize(req.query);
  }
  if (req.params) {
    sanitize(req.params);
  }
  next();
};
