function tableFromJson(json) {

    let col = [];
    for (let i = 0; i < json.length; i++) {
      for (let key in json[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    // Create table.
    const table = document.createElement("table");

    // Create table header row using the extracted headers above.
    let tr = table.insertRow(-1);                   // table row.

    for (let i = 0; i < col.length; i++) {
      let th = document.createElement("th");      // table header.
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (let i = 0; i < json.length; i++) {

      tr = table.insertRow(-1);

      for (let j = 0; j < col.length; j++) {
        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = json[i][col[j]];
      }
    }

    return table
}

function request(method, url, defaultParams = {}) {
  return (params = {}) => {
    const query = new URLSearchParams(params.query).toString();
    const headers = { ...defaultParams.header, ...params.header };

    let body;

    const buildFormData = (object) => {
      const result = new FormData();

      Object.keys(object).forEach((key) => {
        result.append(key, object[key]);
      });

      return result;
    };

    if (params.body) {
      switch (headers.accept) {
        case "multipart/form-data":
          body = buildFormData(params.body);
          break;
        case "application/xml":
          body = jsonToXml(params.body);
          break;
        case "application/json":
          body = JSON.stringify(params.body);
          break;
        default:
          body = params.body;
          break;
      }
    } else if (params.formData) {
      body = buildFormData(params.formData);
    }

    return fetch(`${url}${query ? `?${query}` : ""}`, {
      method,
      headers,
      body,
    }).then(async (response) => {
      let data = null;

      const headersValues = Object.values(headers);
      const headersKeys = Object.keys(headers).map((value) =>
        value.toLocaleLowerCase(),
      );

      switch (headersValues[headersKeys.indexOf("content-type")]) {
        case "multipart/form-data":
          data = await response.formData();
          break;
        case "application/xml":
          data = xmlToJson(await response.text());
          break;
        case "application/json":
          data = await response.json();
          break;
        default:
          break;
      }

      return { response, data };
    });
  };
}

function jsonToXml(o) {
  if (
    typeof o === "object" &&
    o.constructor === Object &&
    Object.keys(o).length === 1
  ) {
    for (var a in o) {
      return toXML(a, o[a]);
    }
  } else {
  }

  function toXML(tag, o) {
    var doc = "<" + tag;
    if (typeof o === "undefined" || o === null) {
      doc += "/>";
      return doc;
    }
    if (typeof o !== "object") {
      doc += ">" + safeXMLValue(o) + "</" + tag + ">";
      return doc;
    }
    if (o.constructor === Object) {
      for (var a in o) {
        if (a.charAt(0) === "@") {
          if (typeof o[a] !== "object") {
            doc += " " + a.substring(1) + '="' + o[a] + '"';
            delete o[a];
          } else {
            throw new Error(typeof o[a] + " being attribute is not supported.");
          }
        }
      }
      if (Object.keys(o).length === 0) {
        doc += "/>";
        return doc;
      } else {
        doc += ">";
      }
      if (typeof o["#text"] !== "undefined") {
        if (typeof o["#text"] !== "object") {
          doc += o["#text"];
          delete o["#text"];
        } else {
          throw new Error(typeof o["#text"] + " being #text is not supported.");
        }
      }
      for (var b in o) {
        if (o[b].constructor === Array) {
          for (var i = 0; i < o[b].length; i++) {
            if (typeof o[b][i] !== "object" || o[b][i].constructor === Object) {
              doc += toXML(b, o[b][i]);
            } else {
              throw new Error(typeof o[b][i] + " is not supported.");
            }
          }
        } else if (o[b].constructor === Object || typeof o[b] !== "object") {
          doc += toXML(b, o[b]);
        } else {
          throw new Error(typeof o[b] + " is not supported.");
        }
      }
      doc += "</" + tag + ">";
      return doc;
    }
  }
  function safeXMLValue(value) {
    var s = value.toString();
    s = s.replace("/&/g", "&amp;");
    s = s.replace('/"/g', "&quot;");
    s = s.replace("/</g", "&lt;");
    s = s.replace("/>/g", "&gt;");
    return s;
  }
}

function xmlToJson(xmlStr) {
  const parser = (xml) => {
    // Create the return object
    var obj = {};

    if (xml.nodeType === 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // text
      obj = xml.nodeValue;
    }

    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
      return node.nodeType === 3;
    });

    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
        return text + node.nodeValue;
      }, "");
    } else if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = parser(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(parser(item));
        }
      }
    }

    return obj;
  };

  return parser(new DOMParser().parseFromString(xmlStr, "text/xml"));
}
