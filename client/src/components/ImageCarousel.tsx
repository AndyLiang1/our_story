import axios from 'axios';
import { useState } from 'react';
import { config } from '../config/config';

export interface IImageCarouselProps {
    images: string[];
    height: string;
    width: string;
}
enum DIRECTION {
    LEFT = 'left',
    RIGHT = 'right'
}

export function ImageCarousel({ images, height, width }: IImageCarouselProps) {
    const [file, setFile] = useState<any>();

    const [currentIndex, setCurrentIndex] = useState(0);

    const changeIndex = (direction: DIRECTION) => {
        if (direction === DIRECTION.LEFT) {
            setCurrentIndex(currentIndex !== 0 ? currentIndex - 1 : images.length - 1);
        } else {
            setCurrentIndex(currentIndex !== images.length - 1 ? currentIndex + 1 : 0);
        }
    };

    const handleChange = (event: any) => {
        setFile(event.target.files[0] as any);
    };

    const submit = async () => {
        if (file) {
            const { data } = await axios.get(`${config.baseUrl}/api/images/${file.name}`);
            try {
                const res = await axios.put(`${data}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: file
                });
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <div className={`${height} ${width} relative`}>
            <div
                onClick={() => {
                    changeIndex(DIRECTION.LEFT);
                }}
                className="absolute left-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                L
            </div>
            <div
                onClick={() => {
                    changeIndex(DIRECTION.RIGHT);
                }}
                className="absolute right-2 top-[50%] translate-x-0 translate-y-[-50%] transform"
            >
                R
            </div>
            <div className="h-full w-full bg-[url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxB9LYAJ-6j2oUhIYzBiscqR2lGjemhGH3DA&s)] bg-cover bg-center"></div>
            {/* <img src=""></img> */}
            <input type="file" multiple accept = "image/*" onChange={handleChange} />
            <button onClick={submit}>Upload</button>
        </div>
    );
}
