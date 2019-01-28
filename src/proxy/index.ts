import { step } from 'prescript'

const handler = {
	get(obj: any, key: any) {
		return (...options: any[]) => {
			step(key, () => obj[key](...options))
			return new Proxy(obj, handler)
		}
	},
}

type Proxify<T> = { [P in keyof T]: T[P] }

export function proxify<T>(o: T): Proxify<T> {
	return new Proxy(o, handler)
}
