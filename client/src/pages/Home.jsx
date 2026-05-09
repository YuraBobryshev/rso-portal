
import blockCutout from '../assets/images/block-cutout.svg';
import blockOvals from '../assets/images/block-ovals.svg';
import patternBlue from '../assets/images/pattern-blue.svg';
import iconHashtag from '../assets/images/icon-hashtag.svg';
import blockLogo from '../assets/images/block-logo.svg';
import girlPhoto from '../assets/images/girl.png';
import topOvals from '../assets/images/top-ovals.svg';
import topCrosses from '../assets/images/top-crosses.svg';
import topBlob from '../assets/images/top-blob.svg';
import topArrow from '../assets/images/top-arrow.svg';
import Header from '../components/Header';

export default function Home() {
return (
  <div className="min-h-screen bg-white w-full overflow-x-hidden"> {/* Общая обертка без items-center */}
    <Header /> 

    <main className="w-full flex flex-col items-center"> {/* Контент страницы со своими правилами */}
    {/* 1. ВЕРХНЯЯ ЛЕНТА ФИГУР (Без рамок) */}
      <section className="w-full overflow-hidden">
        <div className="flex flex-wrap md:flex-nowrap w-full">
          {/* Блок 1: Черный с овалами */}
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-black p-4 relative z-10">
            <img src={topOvals} className="w-full h-full object-contain" alt="Овалы" />
          </div>
          {/* Блок 2: Крестики */}
          <div className="w-1/2 md:w-auto md:flex-[8] aspect-[4/3] bg-white p-4 flex items-center justify-center relative z-10">
            <img src={topCrosses} className="w-full h-full object-contain" alt="Крестики" />
          </div>
          {/* Блок 3: Синяя клякса */}
          <div className="w-full md:w-auto md:flex-[16] aspect-[3/1] bg-white p-4 flex items-center justify-center relative z-10">
            <img src={topBlob} className="w-full h-full object-contain" alt="Клякса" />
          </div>
          {/* Блок 4: Черная стрелка */}
{/* Блок 4: Черная стрелка */}
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-black p-6 relative z-10">
            {/* Добавили класс animate-slide-arrow */}
            <img src={topArrow} className="w-full h-full object-contain animate-slide-arrow cursor-pointer" alt="Стрелка" />
          </div>
          {/* Блок 5: Хэштег */}
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-white p-6 flex items-center justify-center relative z-10">
            <img src={iconHashtag} className="w-full h-full object-contain" alt="Хэштег" />
          </div>
        </div>
      </section>

      {/* 2. HERO СЕКЦИЯ (Текст по центру - остается как есть) */}
      <section className="w-full max-w-7xl mx-auto px-8 py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-title text-black leading-tight uppercase font-bold">
          <span className=" decoration-4 underline-offset-[12px]">СТУДЕНЧЕСКИЕ</span><br />
          <span className=" decoration-4 underline-offset-[12px]">ОТРЯДЫ</span><br />
          <span className=" decoration-4 underline-offset-[12px]">СЕВАСТОПОЛЯ</span>
        </h1>
        <p className="mt-8 font-heading text-black text-sm uppercase tracking-widest font-semibold">
          Мы шторм у Черного моря!
        </p>
      </section>

      {/* 3. НИЖНЯЯ ЛЕНТА ФИГУР (Без рамок) */}
      <section className="w-full overflow-hidden my-10">
        <div className="flex flex-wrap md:flex-nowrap w-full">
          {/* Блок 1: Вырез */}
{/* Блок 1: Вырез */}
          <div className="w-1/2 md:w-auto md:flex-[8] aspect-[4/3] bg-black overflow-hidden group relative z-10">
            {/* Добавили класс animate-breathe */}
            <img src={blockCutout} className="w-full h-full object-cover animate-breathe" alt="Декор" />
          </div>
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-black p-4 relative z-10">
            <img src={blockOvals} className="w-full h-full object-contain" alt="Овалы" />
          </div>
          {/* Блок 3: Синий паттерн */}
          <div className="w-full md:w-auto md:flex-[12] aspect-[2/1] bg-white p-4 flex items-center justify-center">
            <img src={patternBlue} className="h-full w-auto object-contain" alt="Паттерн" />
          </div>
          {/* Блок 4: Синий квадрат */}
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-rso-blue transition-all duration-500 hover:scale-105 cursor-pointer relative z-20"></div>
          {/* Блок 5: Хэштег */}
          <div className="w-1/2 md:w-auto md:flex-[6] aspect-square bg-white p-6 flex items-center justify-center relative z-10">
            <img src={iconHashtag} className="w-full h-full object-contain" alt="Хэштег" />
          </div>
          {/* Блок 6: Логотип */}
          <div className="w-full md:w-auto md:flex-[15] aspect-[5/2] bg-rso-blue overflow-hidden flex items-center justify-center transition-transform hover:-translate-y-2 p-4 relative z-10">
            <img src={blockLogo} className="w-full h-full object-contain" alt="Труд Крут" />
          </div>
        </div>
      </section>

      {/* 3. СЕКЦИЯ "О НАС" */}
      <section className="w-full max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 font-body text-lg leading-relaxed">
          <p>
            Молодежная общероссийская общественная организация <span className="text-rso-blue font-bold">«Российские Студенческие Отряды» (РСО)</span>...
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={girlPhoto} alt="Девушка РСО" className="w-full max-w-md drop-shadow-2xl" />
        </div>
      </section>
      {/* СЕКЦИЯ 4: Статистика */}
      <section className="w-full flex flex-col md:flex-row">
        {/* Черный квадрат со стрелкой */}
        <div className="bg-black text-white w-full md:w-1/4 xl:w-1/5 flex justify-center items-center py-16 md:py-0">
          <span className="text-7xl">↑</span>
        </div>
        
        {/* Синий блок с цифрами */}
        <div className="bg-rso-blue text-white w-full md:w-3/4 xl:w-4/5 flex flex-col items-center py-12 px-8">
          <h2 className="font-title text-xl md:text-3xl mb-12 text-center uppercase">
            Севастопольское региональное отделение<br />
            <span className="text-3xl md:text-5xl mt-2 block">Это более</span>
          </h2>
          
          {/* Сами цифры. Flex-wrap позволяет им переноситься на новую строку, если не влезают */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center font-heading">
            <div>
              <div className="text-5xl md:text-7xl font-bold mb-2">6</div>
              <div className="text-sm uppercase tracking-widest">направлений</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold mb-2">1000</div>
              <div className="text-sm uppercase tracking-widest">бойцов</div>
            </div>
            <div>
              <div className="text-5xl md:text-7xl font-bold mb-2">20</div>
              <div className="text-sm uppercase tracking-widest">отрядов</div>
            </div>
          </div>
        </div>
      </section>
    </main>
   </div>

  );
}