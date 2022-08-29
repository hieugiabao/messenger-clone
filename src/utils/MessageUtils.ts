export type LinkType = { link: string }
export type ResultType = LinkType | string;

export function splitLinkFromMessage(message: string) {
  const URL_REGEX =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gm;

  const result = message.split(" ").reduce<ResultType[]>((acc, item) => {
    const isURL = URL_REGEX.test(item);
    if (isURL)
      acc.push({ link: item } as unknown as ResultType);
    else {
      if (typeof acc.slice(-1)[0] === "string")
        acc = [...acc.slice(0, -1), `${acc.slice(-1)[0]} ${item}`];
      else
        acc.push(item);
    }

    return acc;
  }, []);

  return result;
}
